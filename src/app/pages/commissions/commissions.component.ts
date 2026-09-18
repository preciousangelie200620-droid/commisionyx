import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Artist } from '../../models/artist.model';
import { PriceBreakdown } from '../../models/commission.model';
import { ArtworkService } from '../../services/artwork.service';
import { CommissionService } from '../../services/commission.service';
import { ToastService } from '../../services/toast.service';
import {
  COMMISSION_ART_TYPES,
  COMMISSION_BACKGROUNDS,
  COMMISSION_DEADLINES,
  COMMISSION_STYLES,
  COMMISSION_USAGE
} from '../../data/commission-options.data';

/**
 * The commission request page.
 *
 * The important part is calculateEstimate(), which runs every time the form
 * changes and produces the live price on the right hand side.
 */
@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent implements OnInit {
  /** The reactive form holding every commission choice. */
  commissionForm!: FormGroup;

  /** Artists available to work with. */
  artists: Artist[] = [];

  /** The live price breakdown shown beside the form. */
  breakdown!: PriceBreakdown;

  /** True once the request has been sent, so the confirmation panel can show. */
  submitted = false;

  /** The details of the request that was just sent, for the confirmation panel. */
  submittedSummary: { label: string; value: string }[] = [];

  /** A reference number generated when the form is submitted. */
  referenceNumber = '';

  /** Option lists, kept on the component so the template can loop over them. */
  readonly artTypes = COMMISSION_ART_TYPES;
  readonly styles = COMMISSION_STYLES;
  readonly backgrounds = COMMISSION_BACKGROUNDS;
  readonly usageOptions = COMMISSION_USAGE;
  readonly deadlineOptions = COMMISSION_DEADLINES;

  /** Character counts offered in the form. */
  readonly characterOptions = [1, 2, 3, 4, 5, 6];

  /** The earliest date a customer can ask for. */
  readonly minDeadline: string;

  constructor(
    private formBuilder: FormBuilder,
    private artworkService: ArtworkService,
    private commissionService: CommissionService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    // Deadlines start from tomorrow, so "today" can never be selected.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDeadline = tomorrow.toISOString().split('T')[0];
  }

  /** Build the form with sensible defaults, then work out the first estimate. */
  ngOnInit(): void {
    // Build the form FIRST, so the artist subscription below can safely patch it.
    this.commissionForm = this.formBuilder.group({
      artType: ['fullbody', Validators.required],
      artistId: ['', Validators.required],
      characterCount: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
      style: ['cel', Validators.required],
      background: ['detailed', Validators.required],
      usage: ['personal', Validators.required],
      deadline: ['standard', Validators.required],
      deadlineDate: ['', Validators.required],
      instructions: ['', [Validators.required, Validators.minLength(30)]],
      referenceName: ['']
    });

    // Recalculate the price whenever any control changes.
    this.commissionForm.valueChanges.subscribe(() => this.calculateEstimate());

    // Now that the form exists, load the artists and pick a default.
    this.artworkService.getArtists().subscribe((artists) => {
      this.artists = artists;

      // A link such as "Commission This Artist" arrives as ?artist=3
      const artistFromUrl = Number(this.route.snapshot.queryParamMap.get('artist'));
      const requested = artists.find((artist) => artist.id === artistFromUrl);

      this.commissionForm.patchValue({
        artistId: requested ? requested.id : artists[0].id
      });

      this.calculateEstimate();
    });

    this.calculateEstimate();
  }

  /**
   * Recalculate the live estimate from the current form values.
   * This is what makes the price update as the user changes options.
   */
  calculateEstimate(): void {
    const form = this.commissionForm.value;

    this.breakdown = this.commissionService.calculatePrice(
      form.artType,
      form.style,
      Number(form.characterCount),
      form.background,
      form.usage,
      form.deadline,
      Number(form.artistId)
    );
  }

  /** Look up the readable label of one option, for the summary list. */
  private labelFor(options: { id: string; label: string }[], id: string): string {
    const found = options.find((option) => option.id === id);
    return found ? found.label : '-';
  }

  /** The artist the user picked, used for the summary and the form. */
  get selectedArtist(): Artist | undefined {
    const id = Number(this.commissionForm.value.artistId);
    return this.artists.find((artist) => artist.id === id);
  }

  /**
   * Handle the reference image input.
   * Only the file name is recorded - a real app would upload the file.
   */
  onReferenceSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];

    if (file) {
      this.commissionForm.patchValue({ referenceName: file.name });
    }
  }

  /** Send the request. Only runs when the form is valid. */
  onSubmit(): void {
    if (this.commissionForm.invalid) {
      // Touch every control so the validation messages appear.
      this.commissionForm.markAllAsTouched();
      this.toastService.show('Please fill in every required field.');
      return;
    }

    const form = this.commissionForm.value;

    this.submittedSummary = [
      { label: 'Art type', value: this.labelFor(this.artTypes, form.artType) },
      { label: 'Artist', value: this.selectedArtist ? this.selectedArtist.name : '-' },
      { label: 'Characters', value: String(form.characterCount) },
      { label: 'Style', value: this.labelFor(this.styles, form.style) },
      { label: 'Background', value: this.labelFor(this.backgrounds, form.background) },
      { label: 'Usage', value: this.labelFor(this.usageOptions, form.usage) },
      { label: 'Deadline', value: this.labelFor(this.deadlineOptions, form.deadline) },
      { label: 'Target date', value: form.deadlineDate },
      { label: 'Reference image', value: form.referenceName || 'None attached' }
    ];

    // A short made up reference number for the confirmation screen.
    this.referenceNumber = 'CN-' + Math.floor(100000 + Math.random() * 899999);
    this.submitted = true;
    this.toastService.show('Commission request sent.');

    // Scroll to the confirmation panel so the user sees it immediately.
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  /** Clear the confirmation and let the user send another request. */
  startAnother(): void {
    this.submitted = false;
    this.commissionForm.reset({
      artType: 'fullbody',
      artistId: this.artists.length > 0 ? this.artists[0].id : '',
      characterCount: 1,
      style: 'cel',
      background: 'detailed',
      usage: 'personal',
      deadline: 'standard',
      deadlineDate: '',
      instructions: '',
      referenceName: ''
    });

    this.calculateEstimate();
  }
}
