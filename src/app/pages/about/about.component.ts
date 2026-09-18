import { Component } from '@angular/core';

/**
 * The About page.
 * Static content: what the platform is, how it works and who it is for.
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  /** The principles shown as a grid. */
  readonly values = [
    {
      title: 'Artists Are Paid Properly',
      text: 'The service fee is a flat five percent. No subscription, no listing charge, no ranking auction. What an artist earns is what the invoice says.'
    },
    {
      title: 'One Piece, One Buyer',
      text: 'Original artwork is sold once. When a piece is gone it leaves the catalogue, so you are never holding a file that a hundred other people also own.'
    },
    {
      title: 'Price Before Commitment',
      text: 'The commission form shows a full cost breakdown while you are still deciding. No surprise invoices after the work is finished.'
    },
    {
      title: 'A Shared Aesthetic',
      text: 'Every artist here works in the darker registers: gothic, melancholy, mythic. The catalogue stays coherent instead of trying to please everyone.'
    }
  ];

  /** The team and what each person does. */
  readonly team = [
    { name: 'Mira Halloran', role: 'Founder and Curator', note: 'Former gallery coordinator. Approves every artist on the platform.' },
    { name: 'Theo Brandt', role: 'Head of Artist Relations', note: 'Handles disputes, deadlines and anything that goes sideways.' },
    { name: 'Ana Reyes', role: 'Platform Engineering', note: 'Keeps the marketplace fast, the payments safe and the data private.' }
  ];

  /** A few plain answers to the questions people ask most. */
  readonly faqs = [
    {
      question: 'How long does a commission usually take?',
      answer: 'Between one and eight weeks depending on the size and the artist queue. The commission form lists each artist typical turnaround, and priority deadlines are available for a surcharge.'
    },
    {
      question: 'Can I use the artwork commercially?',
      answer: 'Yes, if you select Commercial Use when requesting. Personal commissions may not be used for products, advertising or anything that generates revenue.'
    },
    {
      question: 'What if the sketch is not what I pictured?',
      answer: 'Every commission includes a revision round at the sketch stage. It is much easier to change direction before the rendering begins, so artists ask for feedback early.'
    },
    {
      question: 'Do you handle physical prints?',
      answer: 'Not yet. Every sale on CommisioNyx is a digital file delivered at print resolution, which you are free to print yourself at any size.'
    },
    {
      question: 'Is this a real store?',
      answer: 'No. CommisioNyx is a student project built with Angular. The catalogue, artists and orders are all sample data, and no payment is ever processed.'
    }
  ];

  /** Which answer is currently open in the FAQ list. */
  openFaq = 0;

  /** Open or close one FAQ answer. */
  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? -1 : index;
  }
}
