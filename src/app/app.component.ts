import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ContactService } from './service/contact.service';

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

interface Message {
  sender: string;
  receiver?: string;
  message: string;
  time?: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('chats', { static: false }) private chatsContainer: ElementRef;

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
  showChats: boolean = false;

  contact: Contact = {
    id: '',
    name:'',
    email: '',
    company: '',
    initials: '',
    phone: '',
    address: '',
    role: '',
    color: '',
  };

  loggedInContact: Contact = this.contacts[0];
  messages: Map<String, Message[]> = new Map();
  message: Message = {
    sender: this.loggedInContact.id,
    message: '',
  };

  constructor( private _snackBar: MatSnackBar, private contactService: ContactService ) {}

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
    this.openAddContact();
    this.isEdit = true;
  }

  openAddContact(): void {
    this.showAddContact = true;
    this.selectedContacts = [];
    this.message.receiver = '';
  }

  deleteContact(): void {
    this.selectedContacts.forEach(item => {
      this.contacts.splice(this.contacts.findIndex(contact => contact.id === item.id), 1);
    });
  }

  getMessages(): Message[] {
    const messages: Message[] = this.messages.get(this.loggedInContact.id);
    return messages ? messages.filter(item => (item.sender === this.loggedInContact.id && item.receiver === this.message.receiver)
      || (item.sender === this.message.receiver && item.receiver === this.loggedInContact.id)) : [];
  }

  openChats(): void {
    this.message.receiver = this.selectedContacts[0].id;
    this.selectedContacts = [];
  }

  closeChats(): void {
    this.message.receiver = '';
    this.message.message = '';
  }

  sendMessage(): void {
    if (!this.message.message.trim()) {
      return;
    }
    this.message.time = new Date();
    const senderMessages: Message[] = this.messages.get(this.message.sender);
    const receiverMessages: Message[] = this.messages.get(this.message.receiver);
    if (senderMessages) {
      senderMessages.push({...this.message});
    } else {
      this.messages.set(this.message.sender, [{...this.message}]);
    }
    if (receiverMessages) {
      receiverMessages.push({...this.message});
    } else {
      this.messages.set(this.message.receiver, [{...this.message}]);
    }
    this.message.message = '';
    setTimeout(() => {
      this.chatsContainer.nativeElement.scrollTop = this.chatsContainer.nativeElement.scrollHeight;
    }, 200);
  }

  getReceiverName(): string {
    return this.contacts.find(item => item.id === this.message.receiver).name;
  }
}
