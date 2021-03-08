import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

interface Contact {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  role: string;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  contactForm: FormGroup;
  title = 'contacts';
  colors: string[] = ['#7eda8d', '#ff689f', '#fd8065'];
  contacts: Contact[] = [
    {
      id: '1',
      name:'Mike Huston',
      email: 'mikehuston@outlook.com',
      company: 'Estra Boutique ltd.',
      initials: 'MH',
      phone: '+12938302002',
      address: '#564, 78th Street, Park Avenue',
      role: 'Product Manager @ FlatCRM management',
      color: '#7eda8d',
    },
    {
      id: '2',
      name:'Amazonia',
      email: 'amazonia@outlook.com',
      company: 'Amazonia Online',
      initials: 'MH',
      phone: '+12938302002',
      address: '#564, 78th Street, Park Avenue',
      role: 'Product Manager @ FlatCRM management',
      color: '#ff689f',
    },
    {
      id: '3',
      name:'Jennifer Pattrick',
      email: 'jenniferpattrick@outlook.com',
      company: 'Alibaba traders co.',
      initials: 'JP',
      phone: '+12938302002',
      address: '#564, 78th Street, Park Avenue',
      role: 'Product Manager @ FlatCRM management',
      color: '#fd8065'
    },
  ];

  selectedContacts: Contact[] = [];
  showAddContact: boolean = false;
  isEdit: boolean = false;

  contact: Contact = {
    id: '',
    name:'',
    email: '',
    company: '',
    initials: '',
    phone: '',
    address: '',
    role: '',
    color: ''
  };

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(){

  }

  addContact(): void {
    if (this.isEdit) {
      this.contact.initials = this.contact.name.split(' ').splice(0, 2).map(item => item.substring(0, 1)).join('');
      this.contacts[this.contacts.findIndex(item => item.id === this.contact.id)] = this.contact;
      this.showAddContact = false;
      this.isEdit = false;
      this.resetContact();
      this.openSnackBar('Contact updated successfully', 'Close');
      return;
    }
    this.contact.id = new Date().getTime() + '';
    this.contact.color = this.colors[this.getRandomInt(0, 2)];
    this.contact.initials = this.contact.name.split(' ').splice(0, 2).map(item => item.substring(0, 1)).join('');
    this.contacts.push(this.contact);
    this.resetContact();
    this.showAddContact = false;
    this.openSnackBar('Contact added successfully', 'Close');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  isValid(): boolean {
    return !!this.contact.name.trim() && !!this.contact.email.trim() && !!this.contact.phone.trim() && !!this.contact.company.trim() && !!this.contact.role.trim() && !!this.contact.address.trim();
  }

  resetContact(): void {
    this.contact = {
      id: '',
      name:'',
      email: '',
      company: '',
      initials: '',
      phone: '',
      address: '',
      role: '',
      color: ''
    };
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  editContact(): void {
    this.contact = {
      ...this.selectedContacts[0]
    };
    this.selectedContacts = [];
    this.showAddContact = true;
    this.isEdit = true;
  }

  deleteContact(): void {
    this.selectedContacts.forEach(item => {
      this.contacts.splice(this.contacts.findIndex(contact => contact.id === item.id), 1);
    });
  }
}
