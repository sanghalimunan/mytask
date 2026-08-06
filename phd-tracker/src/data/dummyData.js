export const dummyData = {
  profile: {
    name: 'Shahril Khairi',
    programStart: '2026-03-24',
    targetMonths: 30,
  },
  milestones: {
    phases: [
      { name: 'Asas', range: '0-6 Bln', progress: 15 },
      { name: 'Pembangunan', range: '7-12 Bln', progress: 35 },
      { name: 'Pengumpulan Data', range: '13-18 Bln', progress: 40 },
      { name: 'Analisis', range: '19-24 Bln', progress: 10 },
      { name: 'Penulisan', range: '25-27 Bln', progress: 0 },
      { name: 'Peringkat Akhir', range: '28-30 Bln', progress: 0 },
    ],
  },
  chapters: [
    { name: 'Introduction', progress: 65 },
    { name: 'Literature Review', progress: 45 },
    { name: 'Methodology', progress: 25 },
    { name: 'Results', progress: 10 },
    { name: 'Discussion', progress: 5 },
    { name: 'Conclusion', progress: 0 },
  ],
  draftTracker: {
    currentDraft: 17,
    targetDraft: 111,
    lastUpdated: '2026-06-28',
  },
  tdr_daily: [
    {
      date: '2026-06-28',
      focus: 'Menulis Problem Statement, kaitkan isu document-centric e-submission',
      activities: ['Jumpa SV - input RO1/RQ', 'Mula coding transkrip interview R1'],
      hoursSpent: 4,
    },
    {
      date: '2026-06-27',
      focus: 'Semak literature review bab 2, tambah rujukan terkini',
      activities: ['Baca 3 artikel jurnal', 'Kemaskini reference list'],
      hoursSpent: 3,
    },
  ],
  tm168_weekly: [
    {
      weekOf: '2026-06-22',
      target: { draftPages: 8, readingArticles: 5, dataCollectionHours: 20, meetings: 1 },
      actual: { draftPages: 5, readingArticles: 3, dataCollectionHours: 12, meetings: 1 },
      percentComplete: 60,
    },
  ],
  fow_fod: [
    {
      date: '2026-06-24',
      type: 'FOW',
      content: 'Draft 017 naik 2 muka surat. SV bagi maklum balas positif, teruskan momentum.',
    },
    {
      date: '2026-06-20',
      type: 'FOD',
      content: 'Tertinggal target reading minggu ini disebabkan urusan keluarga.',
    },
  ],
  svConsultations: [
    {
      date: '2026-06-24',
      topic: 'Problem Statement & Significance',
      comment: 'Good direction, strengthen the gap and local context',
      action: 'Tambah data terkini & justifikasi',
      deadline: '2026-07-03',
    },
  ],
  weeklyTarget: { period: '22-28 Jun 2026', percentComplete: 60 },
  monthlyTarget: { month: 'Jun 2026', percentComplete: 42 },
}
