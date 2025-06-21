import HttpError from '../helpers/HttpError.js';
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  modifyContact,
  updateStatusContact,
} from '../services/contactsServices.js';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';

export const getAllContacts = async (req, res) => {
  const result = await listContacts();

  return res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);

  if (!result) throw HttpError(404);

  return res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);

  if (!result) throw HttpError(404);

  return res.json(result);
};

export const createContact = async (req, res) => {
  const result = await addContact(req.body);

  return res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0)
    throw HttpError(400, 'Body must have at least one field');

  const result = await modifyContact(id, req.body);

  if (!result) throw HttpError(404);

  return res.json(result);
};

export const modifyStatusContact = async (req, res) => {
  const { id } = req.params;

  const result = await updateStatusContact(id, req.body);
  if (!result) throw HttpError(404);
  return res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  modifyStatusContact: ctrlWrapper(modifyStatusContact),
};
