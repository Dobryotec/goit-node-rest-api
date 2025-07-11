import express from 'express';
import contactsControllers from '../controllers/contactsControllers.js';
import validateBody from '../helpers/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsControllers.getAllContacts);

contactsRouter.get('/:id', contactsControllers.getOneContact);

contactsRouter.delete('/:id', contactsControllers.deleteContact);

contactsRouter.post(
  '/',
  upload.single('image'),
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  '/:id',
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  validateBody(updateContactSchema),
  contactsControllers.modifyStatusContact
);

export default contactsRouter;
