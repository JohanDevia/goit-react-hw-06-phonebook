import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addContact,
  deleteContact,
  updateFilter,
} from '../redux/phonebookSlice';
import { nanoid } from 'nanoid';
import {
  Container,
  FormPhonebook,
  ContactsList,
  FinderContacts,
} from './Phonebook.styled';

const Phonebook = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const contacts = useSelector(state => state.contacts);
  const filter = useSelector(state => state.filter);
  const dispatch = useDispatch();

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'number') setNumber(value);
  };

  const handleFilterChange = e => {
    dispatch(updateFilter(e.target.value));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const isNameExists = contacts.some(
      contact => contact.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isNameExists) {
      alert(`The contact ${name.trim()} is already in the agenda.`);
      return;
    }

    if (name.trim() && number.trim()) {
      const newContact = {
        id: nanoid(),
        name: name.trim(),
        number: number.trim(),
      };
      dispatch(addContact(newContact));
      setName('');
      setNumber('');
    }
  };

  const handleContactDelete = id => {
    dispatch(deleteContact(id));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="App">
      <h1>PHONEBOOK</h1>
      <FormPhonebook onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter contact name"
          required
          value={name}
          onChange={handleInputChange}
        />
        <label htmlFor="number">Number</label>
        <input
          type="tel"
          name="number"
          placeholder="Enter contact number"
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
          value={number}
          onChange={handleInputChange}
        />
        <button type="submit">Add Contact</button>
      </FormPhonebook>

      <FinderContacts>
        <p>Contacts</p>
        <label htmlFor="filter">Search: </label>
        <input
          type="text"
          id="filter"
          name="filter"
          placeholder="Search contact"
          value={filter}
          onChange={handleFilterChange}
        />
      </FinderContacts>

      {filteredContacts.map(contact => (
        <ContactsList key={contact.id}>
          »{contact.name}: {contact.number}
          <button
            onClick={() => handleContactDelete(contact.id)}
            style={{ marginLeft: '10px' }}
          >
            Delete
          </button>
        </ContactsList>
      ))}
    </Container>
  );
};

export default Phonebook;
