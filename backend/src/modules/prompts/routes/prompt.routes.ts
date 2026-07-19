import { Router } from 'express';
import { 
  getAllPrompts, 
  getPromptsByCategoryController, 
  createPromptController, 
  updatePromptController, 
  deletePromptController 
} from '../controllers/prompt.controller';

const router = Router();

router.get('/:workspaceId', getAllPrompts);
router.get('/:workspaceId/:category', getPromptsByCategoryController);
router.post('/', createPromptController);
router.put('/:id', updatePromptController);
router.delete('/:id', deletePromptController);

export default router;