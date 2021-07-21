import React, { Component } from 'react';
import Container from './components/Container';
import ContactForm from './components/FormContacts';
import ContactList from './components/ListContacts';
import Filter from './components/Filter';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

class App extends Component {
    state = {
        contacts: [],
        filter: '',
    };

    componentDidMount() {
        const contacts = localStorage.getItem('contacts');
        const parsedcontacts = JSON.parse(contacts);
        parsedcontacts && this.setState({ contacts: parsedcontacts });
    }

    componentDidUpdate(prevProps, prevState) {
        const nextContacts = this.state.contacts;
        const prevContacts = prevState.contacts;

        if (nextContacts !== prevContacts) {
            localStorage.setItem('contacts', JSON.stringify(nextContacts));
        }
    }

    handleAddContact = ({ name, number }) => {
        const contact = {
            id: uuidv4(),
            name,
            number,
        };

        const { contacts } = this.state;

        if (
            contacts.find(
                contact => contact.name.toLowerCase() === name.toLowerCase(),
            )
        ) {
            alert(`${name} is already in contacts.`);
        } else if (contacts.find(contact => contact.number === number)) {
            alert(`${number} is already in contacts.`);
        } else if (name.trim() === '' || number.trim() === '') {
            alert("Enter the contact's name and number phone!");
        } else if (!/\d{3}[-]\d{2}[-]\d{2}/g.test(number)) {
            alert('Enter the correct number phone!');
        } else {
            this.setState(({ contacts }) => ({
                contacts: [...contacts, contact],
            }));
        }
    };

    handleDeleteContact = id =>
        this.setState(({ contacts }) => ({
            contacts: contacts.filter(contact => contact.id !== id),
        }));

    changeFilter = event => {
        this.setState({
            filter: event.currentTarget.value,
        });
    };

    getVisibleContacts = () => {
        const { contacts, filter } = this.state;
        const normalizedFilter = filter.toLowerCase();

        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(normalizedFilter),
        );
    };

    render() {
        const { contacts, filter } = this.state;
        const visibleContacts = this.getVisibleContacts();

        return (
            <Container>
                <h1>Phonebook</h1>
                <ContactForm onSubmit={this.handleAddContact} />
                <h2>Contacts</h2>
                {contacts.length > 1 && (
                    <Filter value={filter} onChange={this.changeFilter} />
                )}

                {contacts.length > 0 ? (
                    <ContactList
                        contacts={visibleContacts}
                        onDelete={this.handleDeleteContact}
                    />
                ) : (
                    <p>Your phonebook is empty. Please add contact.</p>
                )}
            </Container>
        );
    }
}

export default App;
