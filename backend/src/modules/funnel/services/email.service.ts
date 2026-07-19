import { supabase } from '../../../config/database';

// Simulate email sending
export const sendEmail = async (to: string, subject: string, body: string) => {
  console.log(`📧 Sending email to ${to}: ${subject}`);
  // In production: Use SendGrid/Resend API
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, messageId: `em_${Date.now()}` };
};

// Start email sequence
export const startEmailSequence = async (audienceId: string, email: string) => {
  // Check if sequence exists
  const { data: existing } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('audience_id', audienceId)
    .single();

  if (existing) {
    return { error: 'Email sequence already exists' };
  }

  // Create new sequence
  const { data, error } = await supabase
    .from('email_sequences')
    .insert([{
      audience_id: audienceId,
      email: email,
      current_step: 0,
      total_steps: 7,
      status: 'pending',
      created_at: new Date().toISOString(),
    }])
    .select();

  if (error) return { error: error.message };

  // Send first email
  const subject = "👋 Welcome! Let's solve your dental health concerns";
  const body = `Hi there! I noticed you're interested in dental health. I've helped many people find the right solution. 

Here's a quick tip: Did you know that 80% of dental issues can be prevented with proper care?

I've put together a free guide that covers everything you need to know. Would you like me to send it to you?

Reply 'YES' and I'll share it right away.`;

  await sendEmail(email, subject, body);

  // Update sequence
  await supabase
    .from('email_sequences')
    .update({ 
      current_step: 1, 
      status: 'active',
      sent_at: new Date().toISOString(),
    })
    .eq('id', data[0].id);

  return { success: true, sequence: data[0] };
};

// Process email reply
export const processEmailReply = async (sequenceId: string, userReply: string) => {
  const { data: seq } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('id', sequenceId)
    .single();

  if (!seq) return { error: 'Sequence not found' };

  const currentStep = seq.current_step;
  let nextStep = currentStep + 1;
  let response = '';

  // Email sequence logic
  const emailSteps = [
    { step: 1, subject: "Free Guide: Dental Health Secrets", body: "Here's the guide you requested. Let me know if you have any questions!" },
    { step: 2, subject: "Did you know? 💡", body: "Most people don't realize that their diet affects their dental health..." },
    { step: 3, subject: "Recommended Solution", body: "Based on your interest, I'd recommend checking out ProDentim..." },
    { step: 4, subject: "Special Offer Just for You", body: "I've got a limited-time offer for our readers..." },
    { step: 5, subject: "Still Thinking? 🤔", body: "Here's what others are saying about this solution..." },
    { step: 6, subject: "Final Reminder ⏰", body: "This offer expires in 24 hours. Don't miss out!" },
  ];

  if (currentStep < emailSteps.length) {
    const step = emailSteps[currentStep];
    response = step.body;
    await sendEmail(seq.email, step.subject, response);
  } else {
    response = "Thanks for your interest! We'll be in touch if anything changes.";
    await sendEmail(seq.email, "Thanks for connecting!", response);
    nextStep = seq.total_steps;
  }

  // Update sequence
  await supabase
    .from('email_sequences')
    .update({ 
      current_step: nextStep,
      status: nextStep >= seq.total_steps ? 'completed' : 'active',
    })
    .eq('id', sequenceId);

  return { success: true, reply: response, step: nextStep };
};