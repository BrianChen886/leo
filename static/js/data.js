// All page content lives here. Edit this file to change numbers, clips or references.
window.LEO = {
  title: 'LEO: Latent Episodic Overview for Action Chunking Transformers',
  authors: ['Ammaar Firozi', 'Jake D. Browning', 'Bo-Hung Chen', 'Yu-Lun Chou', 'Aaron Jacobs', 'Linh-Co Bui'],
  affiliation: 'Robotics Institute, Carnegie Mellon University',
  // Every author is marked with * and this note.
  authorNote: 'Equal contribution',

  // Numbered in the order given here. Cite with the key.
  references: [
    {
      key: 'rmbench',
      authors: 'T. Chen et al.',
      title: 'RMBench: Memory-Dependent Robotic Manipulation Benchmark with Insights into Policy Design',
      venue: 'arXiv:2603.01229, 2026',
      url: 'https://arxiv.org/abs/2603.01229',
    },
    {
      key: 'act',
      authors: 'T. Z. Zhao, V. Kumar, S. Levine, C. Finn',
      title: 'Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware',
      venue: 'RSS 2023',
      url: 'https://arxiv.org/abs/2304.13705',
    },
    {
      key: 'gmp',
      authors: 'Y. Gao, J. Liu, S. Li, S. Song',
      title: 'Gated Memory Policy',
      venue: 'arXiv:2604.18933, 2026',
      url: 'https://arxiv.org/abs/2604.18933',
    },
    {
      key: 'smt',
      authors: 'A. Kumar, P. Isola',
      title: 'Pretraining Recurrent Networks without Recurrence',
      venue: 'arXiv:2606.06479, 2026',
      url: 'https://arxiv.org/abs/2606.06479',
    },
    {
      key: 'imprint',
      authors: 'Y. Wu, R. Shah, S. Huang, S. A. Sontakke, H. Bharadhwaj, A. Bajcsy, M. Simchowitz, G. Shi',
      title: 'Memory Without Curation: Learning Multi-Stream Latent Memory for Robot Policies',
      venue: 'arXiv:2610.14406, 2026',
      url: 'https://arxiv.org/abs/2610.14406',
    },
  ],

  // Policy names used everywhere on the page.
  policies: {
    rmbenchAct: 'RMBench ACT',
    ourAct: 'ACT in our implementation',
    memory: 'ACT + memory',
    gated: 'ACT + gated memory',
    firstFrame: 'ACT + first-frame memory',
    armHistory: 'ACT + arm-history memory',
    smt: 'ACT-SMT',
  },

  tasks: [
    {
      id: 'rearrange',
      name: 'Rearrange Blocks',
      goal: 'Move the block between the two mats onto the empty mat, press the button, then move the other block to the space between the mats.',
    },
    {
      id: 'putback',
      name: 'Put Back Block',
      goal: 'A block starts on one of four mats. Move it to the center, press the button, then put it back on the mat it came from.',
    },
    {
      id: 'observe',
      name: 'Observe and Pick Up',
      goal: 'A target object is shown on a shelf and then hidden by a screen. Pick up the matching object from the five on the table.',
    },
  ],

  // Success rate (%) over 100 rollouts. null = not evaluated.
  // source 'ours': our runs, training seed 0. source 'rmbench': Table 1 of the RMBench paper (arXiv v4).
  // source 'imprint': Table 10 of the IMPRINT paper (arXiv v1).
  results: [
    {
      group: 'ACT without memory',
      rows: [
        { label: 'ACT', source: 'rmbench', rearrange: 29, observe: 1, putback: 0 },
        { policy: 'rmbenchAct', source: 'ours', note: 'official code, our run', rearrange: 38, observe: 3, putback: 0 },
        { policy: 'ourAct', source: 'ours', rearrange: 0, observe: 2, putback: 32 },
      ],
    },
    {
      group: 'ACT with memory',
      rows: [
        { policy: 'memory', source: 'ours', rearrange: 100, observe: 2, putback: 68 },
        { policy: 'gated', source: 'ours', rearrange: 9, observe: 3, putback: 20 },
        { policy: 'firstFrame', source: 'ours', rearrange: 9, observe: 1, putback: 0 },
        { policy: 'armHistory', source: 'ours', rearrange: 100, observe: 2, putback: 100 },
        { policy: 'smt', source: 'ours', rearrange: null, observe: 6, putback: null },
      ],
    },
    {
      group: 'Other policies evaluated by RMBench',
      rows: [
        { label: 'DP', source: 'rmbench', rearrange: 0, observe: 1, putback: 0 },
        { label: 'Pi0.5', source: 'rmbench', rearrange: 13, observe: 9, putback: 11 },
        { label: 'X-VLA', source: 'rmbench', rearrange: 13, observe: 9, putback: 18 },
        { label: 'QwenOFT', source: 'rmbench', rearrange: 0, observe: 0, putback: 0 },
        { label: 'MemER', source: 'rmbench', rearrange: 17, observe: 7, putback: 0 },
        { label: 'MemoryVLA', source: 'rmbench', rearrange: 22, observe: 0, putback: 50 },
        { label: 'Mem-0', source: 'rmbench', rearrange: 89, observe: 4, putback: 90 },
      ],
    },
    {
      // Table 10 of the IMPRINT paper (arXiv v1). IMPRINT adds memory to the Pi0.5 VLA.
      group: 'IMPRINT',
      rows: [
        { label: 'Pi0.5, no memory', source: 'imprint', note: 'the base model IMPRINT builds on', rearrange: 63, observe: 8, putback: 20 },
        { label: 'IMPRINT (full)', source: 'imprint', rearrange: 100, observe: 9, putback: 100 },
        { label: 'IMPRINT (recurrent)', source: 'imprint', rearrange: 99, observe: 6, putback: 100 },
      ],
    },
  ],

  // Each clip shows three policies side by side on the same evaluation seed.
  // panels: [policy key, succeeded?, what happened]
  heroClip: {
    file: '01_rearrange_blocks_seed100002',
    panels: [
      ['rmbenchAct', false, 'never presses the button'],
      ['ourAct', false, 'does not place the first block'],
      ['memory', true, 'completes the task'],
    ],
  },
  clips: {
    rearrange: [
      {
        label: 'Seed 100004',
        file: '02_rearrange_blocks_seed100004',
        panels: [
          ['rmbenchAct', false, 'never presses the button'],
          ['ourAct', false, 'does not place the first block'],
          ['memory', true, 'completes the task'],
        ],
      },
      {
        label: 'Seed 100000',
        file: '03_rearrange_blocks_seed100000',
        panels: [
          ['rmbenchAct', true, 'completes the task'],
          ['ourAct', false, 'does not place the first block'],
          ['memory', true, 'completes the task'],
        ],
      },
      {
        label: 'Seed 100002',
        file: '01_rearrange_blocks_seed100002',
        panels: [
          ['rmbenchAct', false, 'never presses the button'],
          ['ourAct', false, 'does not place the first block'],
          ['memory', true, 'completes the task'],
        ],
      },
    ],
    putback: [
      {
        label: 'Starts left',
        file: '04_put_back_block_seed100003',
        panels: [
          ['ourAct', false, 'puts it on the back mat'],
          ['memory', true, 'returns it to the left mat'],
          ['armHistory', true, 'returns it to the left mat'],
        ],
      },
      {
        label: 'Starts right',
        file: '05_put_back_block_seed100000',
        panels: [
          ['ourAct', false, 'puts it on the back mat'],
          ['memory', true, 'returns it to the right mat'],
          ['armHistory', true, 'returns it to the right mat'],
        ],
      },
      {
        label: 'Starts front',
        file: '06_put_back_block_seed100007',
        panels: [
          ['ourAct', false, 'puts it on the back mat'],
          ['memory', true, 'returns it to the front mat'],
          ['armHistory', true, 'returns it to the front mat'],
        ],
      },
      {
        label: 'Starts back',
        file: '07_put_back_block_seed100002',
        panels: [
          ['ourAct', true, 'returns it to the back mat'],
          ['memory', false, 'never moves the block'],
          ['armHistory', true, 'returns it to the back mat'],
        ],
      },
    ],
    observe: [
      {
        label: 'ACT-SMT succeeds',
        file: '08_observe_and_pickup_seed100015',
        panels: [
          ['ourAct', false, 'does not lift any object'],
          ['memory', false, 'picks up the wrong object'],
          ['smt', true, 'picks up the object that was shown'],
        ],
      },
      {
        label: 'All fail',
        file: '09_observe_and_pickup_seed100033',
        panels: [
          ['ourAct', false, 'does not lift any object'],
          ['memory', false, 'picks up the wrong object'],
          ['smt', false, 'does not lift any object'],
        ],
      },
    ],
  },
};
