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
    rmbenchAct: 'ACT (official code)',
    ourAct: 'ACT (our implementation)',
    memory: 'ACT + frame memory',
    gated: 'ACT + gated frame memory',
    firstFrame: 'ACT + first-frame memory',
    armHistory: 'ACT + arm-history memory',
    smt: 'ACT-SMT',
    headB: 'ACT + memory head',
    headA: 'ACT + memory head, predicted goals only',
    headOracle: 'ACT + memory head, given the true goal',
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

  // Tasks with videos: the three above plus a long-horizon task evaluated with training seed 0 only.
  videoTasks: [
    { id: 'rearrange' },
    { id: 'putback' },
    { id: 'observe' },
    {
      id: 'ranking',
      name: 'Blocks Ranking Try',
      goal: 'Long-horizon task: put the blocks in the correct order within 3,500 steps. Demonstrations are 550 to 2,400 steps long.',
    },
  ],

  // Success rate (%) over 100 rollouts. null = not evaluated.
  // Our runs: one value per training seed (0, 1, 2); the table shows the mean and the seeds.
  // Source: docs/results_30k.md (v4.1, temporal aggregation on) and results/memhead_* in the LEO code repo.
  // RMBench rows: Table 1 of the RMBench paper (arXiv v4). IMPRINT rows: Table 10 of the IMPRINT paper (arXiv v1).
  results: [
    {
      group: 'Ours',
      rows: [
        { policy: 'rmbenchAct', rearrange: [38, 0, 0], observe: [3, 5, 1], putback: [0, 49, 0] },
        { policy: 'ourAct', rearrange: [0, 0, 0], observe: [2, 0, 3], putback: [32, 0, 0] },
        { policy: 'memory', rearrange: [100, 45, 8], observe: [2, 2, 2], putback: [68, 68, 68] },
        { policy: 'gated', rearrange: [9, 19, 1], observe: [3, 1, 3], putback: [20, 0, 31] },
        { policy: 'firstFrame', rearrange: [9, 19, 15], observe: [1, 0, 2], putback: [0, 17, 0] },
        { policy: 'armHistory', rearrange: [100, 65, 50], observe: [2], putback: [100, 100, 100] },
        { policy: 'smt', rearrange: null, observe: [6], putback: null },
        { policy: 'headB', rearrange: [6], observe: [16], putback: [68] },
        { policy: 'headA', rearrange: [11], observe: [10], putback: [0] },
      ],
    },
    {
      group: 'Reported in RMBench',
      cite: 'rmbench',
      rows: [
        { label: 'ACT', rearrange: 29, observe: 1, putback: 0 },
        { label: 'DP', rearrange: 0, observe: 1, putback: 0 },
        { label: 'Pi0.5', rearrange: 13, observe: 9, putback: 11 },
        { label: 'X-VLA', rearrange: 13, observe: 9, putback: 18 },
        { label: 'QwenOFT', rearrange: 0, observe: 0, putback: 0 },
        { label: 'MemER', rearrange: 17, observe: 7, putback: 0 },
        { label: 'MemoryVLA', rearrange: 22, observe: 0, putback: 50 },
        { label: 'Mem-0', rearrange: 89, observe: 4, putback: 90 },
      ],
    },
    {
      group: 'Reported in IMPRINT',
      cite: 'imprint',
      rows: [
        { label: 'Pi0.5 (no memory)', rearrange: 63, observe: 8, putback: 20 },
        { label: 'IMPRINT (full)', rearrange: 100, observe: 9, putback: 100 },
        { label: 'IMPRINT (recurrent)', rearrange: 99, observe: 6, putback: 100 },
      ],
    },
  ],

  // Each clip shows three policies side by side on the same evaluation seed.
  // panels: [policy key, succeeded?]
  heroClip: {
    label: 'Seed 100002',
    file: '01_rearrange_blocks_seed100002',
    panels: [
      ['rmbenchAct', false],
      ['ourAct', false],
      ['memory', true],
    ],
  },
  clips: {
    rearrange: [
      {
        label: 'Seed 100004',
        file: '02_rearrange_blocks_seed100004',
        panels: [
          ['rmbenchAct', false],
          ['ourAct', false],
          ['memory', true],
        ],
      },
      {
        label: 'Seed 100000',
        file: '03_rearrange_blocks_seed100000',
        panels: [
          ['rmbenchAct', true],
          ['ourAct', false],
          ['memory', true],
        ],
      },
      {
        label: 'Seed 100002',
        file: '01_rearrange_blocks_seed100002',
        panels: [
          ['rmbenchAct', false],
          ['ourAct', false],
          ['memory', true],
        ],
      },
    ],
    putback: [
      {
        label: 'Block starts on the left mat',
        file: '04_put_back_block_seed100003',
        panels: [
          ['ourAct', false],
          ['memory', true],
          ['armHistory', true],
        ],
      },
      {
        label: 'Block starts on the right mat',
        file: '05_put_back_block_seed100000',
        panels: [
          ['ourAct', false],
          ['memory', true],
          ['armHistory', true],
        ],
      },
      {
        label: 'Block starts on the front mat',
        file: '06_put_back_block_seed100007',
        panels: [
          ['ourAct', false],
          ['memory', true],
          ['armHistory', true],
        ],
      },
      {
        label: 'Block starts on the back mat',
        file: '07_put_back_block_seed100002',
        panels: [
          ['ourAct', true],
          ['memory', false],
          ['armHistory', true],
        ],
      },
    ],
    observe: [
      {
        label: 'Seed 100015',
        file: '08_observe_and_pickup_seed100015',
        panels: [
          ['ourAct', false],
          ['memory', false],
          ['smt', true],
        ],
      },
      {
        label: 'Seed 100033',
        file: '09_observe_and_pickup_seed100033',
        panels: [
          ['ourAct', false],
          ['memory', false],
          ['smt', false],
        ],
      },
      {
        label: 'Ego view, seed 100000',
        file: '13_observe_and_pickup_ego_seed100000',
        panels: [
          ['headA', true],
          ['headB', true],
          ['headOracle', false],
        ],
      },
      {
        label: 'Ego view, seed 100001',
        file: '14_observe_and_pickup_ego_seed100001',
        panels: [
          ['headA', false],
          ['headB', false],
          ['headOracle', true],
        ],
      },
    ],
    ranking: [
      {
        label: 'Seed 100000',
        file: '10_blocks_ranking_try_seed100000',
        panels: [
          ['ourAct', false],
          ['memory', true],
          ['armHistory', true],
        ],
      },
      {
        label: 'Seed 100001',
        file: '12_blocks_ranking_try_seed100001',
        panels: [
          ['ourAct', false],
          ['memory', false],
          ['armHistory', true],
        ],
      },
    ],
  },
};
