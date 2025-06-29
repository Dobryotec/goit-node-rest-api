import HttpError from '../helpers/HttpError.js';
import {
  addContact,
  getContact,
  listContacts,
  removeContact,
  modifyContact,
  updateStatusContact,
} from '../services/contactsServices.js';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const { id: owner } = req.user;

  const filter = { owner };

  if (favorite !== undefined) {
    filter.favorite = favorite === 'true';
  }

  const { rows: contacts, count } = await listContacts({
    where: filter,
    skip,
    limit,
  });

  return res.json({
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    contacts,
  });
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await getContact({ id, owner });

  if (!result) throw HttpError(404);

  return res.json(result);
};

const deleteContact = async (req, res) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const result = await removeContact({ id, owner });

  if (!result) throw HttpError(404);

  return res.json(result);
};

const createContact = async (req, res) => {
  const { id } = req.user;
  const result = await addContact({ ...req.body, owner: id });

  return res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, 'Body must have at least one field');

  const result = await modifyContact({ id, owner }, req.body);

  if (!result) throw HttpError(404);

  return res.json(result);
};

const modifyStatusContact = async (req, res) => {
  const { id: owner } = req.user;
  const { id } = req.params;

  const result = await updateStatusContact({ id, owner }, req.body);
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
