/* global React, ReactDOM, htm, LEO */
// Layout follows the Nerfies project-page template (Bulma). Content is in data.js.
(function () {
  const { useState, useEffect, useRef } = React;
  const html = htm.bind(React.createElement);
  const D = window.LEO;

  const refNumber = (key) => D.references.findIndex((r) => r.key === key) + 1;
  const taskById = (id) => D.tasks.find((t) => t.id === id);

  /* ---------- small pieces ---------- */

  function Cite({ k }) {
    const n = refNumber(k);
    const ref = D.references[n - 1];
    // Carries its own leading space, so write it directly after the word it follows.
    return html`${'\u00a0'}<a className="cite" href=${'#ref-' + k} title=${ref.authors + '. ' + ref.title + '. ' + ref.venue}>[${n}]</a>`;
  }

  function Tabs({ items, value, onChange, label }) {
    return html`
      <div className="tabs is-centered is-boxed" role="tablist" aria-label=${label}>
        <ul>
          ${items.map(
            (it) => html`
              <li key=${it.id} className=${it.id === value ? 'is-active' : ''}>
                <a role="tab" href="#" aria-selected=${it.id === value} onClick=${(e) => { e.preventDefault(); onChange(it.id); }}>${it.name}</a>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  // One side-by-side clip. The label bar burned into the video is cropped off
  // and replaced by the labels rendered here.
  function Clip({ clip, autoplay }) {
    const ref = useRef(null);
    useEffect(() => {
      const v = ref.current;
      if (!v || !('IntersectionObserver' in window)) return undefined;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        },
        { threshold: 0.5 }
      );
      io.observe(v);
      return () => io.disconnect();
    }, [clip.file]);
    return html`
      <figure className="clip">
        <div className="clip-labels">
          ${clip.panels.map(
            ([policy, ok, what]) => html`
              <div key=${policy} className="clip-label">
                <span className="clip-policy">${D.policies[policy]}</span>
                <span className=${'outcome ' + (ok ? 'ok' : 'bad')}>${ok ? 'Success' : 'Failure'}<span className="what">: ${what}</span></span>
              </div>
            `
          )}
        </div>
        <div className="clip-frame">
          <video
            key=${clip.file}
            ref=${ref}
            controls
            loop
            muted
            playsInline
            autoPlay=${autoplay}
            preload=${autoplay ? 'auto' : 'none'}
            poster=${'./videos/' + clip.file + '.jpg'}
            src=${'./videos/' + clip.file + '.mp4'}
          ></video>
        </div>
      </figure>
    `;
  }

  /* ---------- sections ---------- */

  function Header() {
    return html`
      <section className="hero">
        <div className="hero-body">
          <div className="container is-max-desktop has-text-centered">
            <h1 className="title is-1 publication-title">${D.title}</h1>
            <div className="is-size-5 publication-authors">
              ${D.authors.map(
                (a, i) => html`<span key=${a} className="author-block">${a}<sup>*</sup>${i < D.authors.length - 1 ? ',' : ''}${' '}</span>`
              )}
            </div>
            <div className="is-size-5 publication-authors">
              <span className="author-block">${D.affiliation}</span>
            </div>
            <div className="is-size-6 publication-authors author-note"><sup>*</sup>${D.authorNote}</div>
            <div className="publication-links">
              <span className="link-block">
                <a href="#results" className="button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fas fa-table"></i></span><span>Results</span>
                </a>
              </span>
              <span className="link-block">
                <a href="#videos" className="button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fas fa-video"></i></span><span>Videos</span>
                </a>
              </span>
              <span className="link-block">
                <a href="https://github.com/RoboTwin-Platform/RMBench" className="external-link button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fab fa-github"></i></span><span>RMBench</span>
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Teaser() {
    return html`
      <section className="hero teaser">
        <div className="container is-max-desktop">
          <div className="hero-body">
            <${Clip} clip=${D.heroClip} autoplay=${true} />
            <h2 className="subtitle has-text-centered teaser-caption">
              Rearrange Blocks from the same initial scene. ACT without memory fails; ACT with a memory of the
              episode completes the task.
            </h2>
          </div>
        </div>
      </section>
    `;
  }

  function Abstract() {
    return html`
      <section className="section">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3">Abstract</h2>
              <div className="content has-text-justified">
                <p>
                  Action Chunking with Transformers (ACT)<${Cite} k="act" /> is a strong and lightweight baseline
                  for imitation-based robotic manipulation, but the policy conditions only on the current
                  observation and has no mechanism for retaining information from earlier in an episode. This
                  limits its performance on tasks where the correct action depends on events that are no longer
                  visible, such as which object was moved, which steps have been completed, or what a previous
                  state looked like. Current policies often use vision-language models to provide an overview of
                  the history through selected frames and text descriptions, which is compute heavy at inference
                  time and loses information by compressing spatio-temporal features into natural language.
                </p>
                <p>
                  We augment ACT with two memory mechanisms, a frame memory read through cross-attention
                  following Gated Memory Policy<${Cite} k="gmp" /> and a recurrent latent memory trained with
                  Supervised Memory Training<${Cite} k="smt" />, and evaluate them on three tasks from
                  RMBench<${Cite} k="rmbench" />, a benchmark of memory-dependent bimanual manipulation. With
                  the frame memory, the success rate of ACT rises from 0% to 100% on Rearrange Blocks and from
                  32% to 68% on Put Back Block. A memory that stores only past joint positions reaches 100% on
                  both tasks, which matches the results reported for IMPRINT<${Cite} k="imprint" /> with a
                  policy of about 80M parameters trained from scratch. Gating the memory lowers the success
                  rate, and no policy we tested solves Observe and Pick Up. All of our results are from a
                  single training seed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Method() {
    return html`
      <section className="section" id="method">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3 has-text-centered">Method</h2>
              <div className="content has-text-justified">
                <p>
                  ACT<${Cite} k="act" /> predicts a chunk of future actions from the current camera images and
                  joint positions. We keep the policy and its training recipe unchanged and add a memory of the
                  episode in two ways. The two variants are trained and evaluated separately.
                </p>
                <h3 className="title is-5">Frame memory</h3>
                <p>
                  Following Gated Memory Policy<${Cite} k="gmp" />, the first frame and every fourth past frame
                  of the episode are stored as one token each, so that at step <i>t</i> the memory is
                  <i> M<sub>t</sub></i> = {<i>m</i><sub>0</sub>, <i>m</i><sub>4</sub>, <i>m</i><sub>8</sub>, ...}.
                  A token <i>m<sub>k</sub></i> encodes the camera images, the joint positions and the time step
                  of frame <i>k</i>. A cross-attention sublayer added to the ACT decoder reads the memory and
                  updates the action queries <i>q</i> as
                </p>
                <p className="eq">
                  <i>q'</i> = <i>q</i> + <i>g<sub>t</sub></i> CrossAttn(<i>q</i>, <i>M<sub>t</sub></i>),
                </p>
                <p>
                  where the gate <i>g<sub>t</sub></i> is 0 or 1 and is computed from the current observation.
                  With the gate closed the model reduces to the original ACT.
                </p>
                <p>
                  We evaluate four versions of this memory. In ${D.policies.memory} the gate is fixed open, so
                  the memory is read at every step. In ${D.policies.gated} the gate is calibrated as in Gated
                  Memory Policy and then frozen, and it decides at each step whether the memory is read.
                  ${' '}${D.policies.firstFrame} stores only the first frame. In ${D.policies.armHistory} the image
                  features are removed from every token, so the memory holds only past joint positions and
                  time steps.
                </p>
                <h3 className="title is-5">Latent memory (ACT-SMT)</h3>
                <p>
                  The second variant summarizes the episode in a fixed-size latent memory
                  <i> z<sub>t</sub></i>. Following Supervised Memory Training<${Cite} k="smt" />, a bidirectional
                  Transformer encoder that sees the full history produces the memory, a causal decoder predicts
                  future observations from it, and a small recurrent updater <i>f</i> is trained with one-step
                  supervision to map the current memory and the next observation <i>x</i><sub><i>t</i>+1</sub> to
                  the next memory:
                </p>
                <p className="eq">
                  <i>z</i><sub><i>t</i>+1</sub> = <i>f</i>(<i>z<sub>t</sub></i>, <i>x</i><sub><i>t</i>+1</sub>).
                </p>
                <p>
                  The encoder and decoder are used only during pretraining. The updater is then frozen and run
                  online, and its memory is given to ACT as additional input tokens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Cell({ value, best }) {
    if (value === null || value === undefined) {
      return html`<td className="num na" title="Not evaluated">n/a</td>`;
    }
    return html`<td className="num">${best ? html`<b>${value}</b>` : value}</td>`;
  }

  function Results() {
    const cols = D.tasks.map((t) => t.id);
    const all = D.results.reduce((acc, g) => acc.concat(g.rows), []);
    const best = {};
    cols.forEach((c) => {
      best[c] = Math.max.apply(null, all.map((r) => (r[c] === null ? -1 : r[c])));
    });
    return html`
      <section className="section" id="results">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3 has-text-centered">Results</h2>
              <div className="content has-text-justified">
                <p>
                  We use three RMBench tasks. In Rearrange Blocks the policy must remember which steps it has
                  already completed, in Put Back Block the mat a block started on, and in Observe and Pick Up
                  an object that was shown and then hidden. All of our policies are trained from scratch with
                  the RMBench ACT recipe<${Cite} k="rmbench" /> (6,000 epochs, batch size 8, 50 demonstrations
                  per task with 10 held out) and evaluated over 100 rollouts with temporal aggregation.
                </p>
              </div>
              <div className="table-container">
                <table className="table is-fullwidth results">
                  <caption>
                    Table 1. Success rate (%) over 100 rollouts. The best result in each column is in bold.
                    ACT-SMT was evaluated on Observe and Pick Up only (n/a elsewhere).
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Policy</th>
                      ${D.tasks.map((t) => html`<th key=${t.id} scope="col" className="num">${t.name}</th>`)}
                    </tr>
                  </thead>
                  ${D.results.map(
                    (g) => html`
                      <tbody key=${g.group}>
                        <tr className="group">
                          <th colSpan="4" scope="colgroup">${g.group}${g.cite && html`<${Cite} k=${g.cite} />`}</th>
                        </tr>
                        ${g.rows.map(
                          (r) => html`
                            <tr key=${r.policy || r.label}>
                              <th scope="row">${r.label || D.policies[r.policy]}</th>
                              ${cols.map((c) => html`<${Cell} key=${c} value=${r[c]} best=${r[c] === best[c]} />`)}
                            </tr>
                          `
                        )}
                      </tbody>
                    `
                  )}
                </table>
              </div>
              <div className="content has-text-justified">
                <p>
                  ${D.policies.rmbenchAct} is the ACT implementation released with RMBench, trained by us. ${D.policies.ourAct} is
                  our own code with the memory removed, and is the baseline for the memory variants. The
                  RMBench and IMPRINT rows are taken from Table 1 of<${Cite} k="rmbench" /> and Table 10
                  of<${Cite} k="imprint" />; we did not rerun them.
                </p>
                <p>
                  Reading the frame memory at every step raises ACT from 0% to 100% on Rearrange Blocks and
                  from 32% to 68% on Put Back Block. With the gate, these fall to 9% and 20%. The arm-history
                  memory, which stores no images, reaches 100% on both tasks, so on these two tasks the
                  improvement comes from the history of the arm rather than from past images. On Put Back
                  Block, ACT without memory returns the block to the back mat in every rollout and succeeds
                  only when the block started there. Observe and Pick Up remains unsolved: our best result is
                  6% with ACT-SMT, and the best reported result is 9%<${Cite} k="rmbench" /><${Cite} k="imprint" />.
                </p>
                <p>
                  Results vary across training seeds. ${D.policies.rmbenchAct} scores 38%, 0% and 0% on
                  Rearrange Blocks and 0%, 49% and 0% on Put Back Block for seeds 0, 1 and 2. The memory
                  variants have been trained with seed 0 only.
                </p>
                <h3 className="title is-5">Comparison with IMPRINT</h3>
                <p>
                  IMPRINT<${Cite} k="imprint" /> adds memory to Pi0.5, a pretrained vision-language-action
                  model, and reports 100% on Rearrange Blocks and Put Back Block. ACT with arm-history memory
                  reaches the same success rate on these two tasks with a smaller model and less training
                  (Table 2). The comparison is limited: IMPRINT is evaluated on all nine RMBench tasks, while
                  our results cover three tasks and one training seed, and we have not tested whether longer
                  training changes our results.
                </p>
              </div>
              <div className="table-container">
                <table className="table is-fullwidth budget">
                  <caption>
                    Table 2. Model size and training budget. Training samples seen is gradient updates times
                    batch size. IMPRINT figures are from Tables 3 and 10 of<${Cite} k="imprint" />; its
                    pretraining is not counted. Parameter counts are approximate.
                  </caption>
                  <thead>
                    <tr>${D.budget.columns.map((c, i) => html`<th key=${i} scope="col">${c}</th>`)}</tr>
                  </thead>
                  <tbody>
                    ${D.budget.rows.map(
                      (r) => html`
                        <tr key=${r[0]}>
                          <th scope="row">${r[0]}</th>
                          <td>${r[1]}</td>
                          <td>${r[2]}</td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Videos() {
    const [taskId, setTaskId] = useState(D.tasks[0].id);
    const [index, setIndex] = useState(0);
    const task = taskById(taskId);
    const clips = D.clips[taskId];
    const clip = clips[index];
    const pick = (id) => {
      setTaskId(id);
      setIndex(0);
    };
    return html`
      <section className="section" id="videos">
        <div className="container is-max-desktop">
          <h2 className="title is-3 has-text-centered">Rollout Videos</h2>
          <div className="columns is-centered">
            <div className="column is-four-fifths content has-text-justified">
              <p>
                Each video shows three policies on the same evaluation seed, so all three start from the same
                scene. Videos are recorded from the head camera during evaluation and are not edited.
              </p>
            </div>
          </div>
          <${Tabs} items=${D.tasks} value=${taskId} onChange=${pick} label="Task" />
          <p className="goal has-text-centered">${task.goal}</p>
          <div className="buttons is-centered" role="group" aria-label="Evaluation scene">
            ${clips.map(
              (c, i) => html`
                <button
                  key=${c.file}
                  aria-pressed=${i === index}
                  className=${'button is-small ' + (i === index ? 'is-dark' : '')}
                  onClick=${() => setIndex(i)}
                >
                  ${c.label}
                </button>
              `
            )}
          </div>
          <${Clip} clip=${clip} autoplay=${false} />
        </div>
      </section>
    `;
  }

  function References() {
    const bib = `@misc{leo2026,
  author = {Firozi, Ammaar and Browning, Jake D. and Chen, Bo-Hung and Chou, Yu-Lun and Jacobs, Aaron and Bui, Linh-Co},
  title  = {LEO: Latent Episodic Overview for Action Chunking Transformers},
  year   = {2026},
  note   = {Course project, CMU 16-831 Introduction to Robot Learning}
}`;
    return html`
      <section className="section" id="BibTeX">
        <div className="container is-max-desktop content">
          <h2 className="title is-3">BibTeX</h2>
          <pre><code>${bib}</code></pre>
          <h2 className="title is-3" id="references">References</h2>
          <ol className="refs">
            ${D.references.map(
              (r) => html`
                <li key=${r.key} id=${'ref-' + r.key}>
                  ${r.authors.replace(/\.$/, '')}. <a href=${r.url}>${r.title}</a>. ${r.venue}.
                </li>
              `
            )}
          </ol>
          <h2 className="title is-3">Acknowledgements</h2>
          <p>
            RMBench<${Cite} k="rmbench" /> provides the simulator, tasks, expert demonstrations and evaluation code.
            This project was done for 16-831 Introduction to Robot Learning at Carnegie Mellon University, Fall 2026.
          </p>
        </div>
      </section>
    `;
  }

  function Footer() {
    return html`
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>Page template borrowed from <a href="https://nerfies.github.io/">Nerfies</a>.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function App() {
    return html`
      <${React.Fragment}>
        <${Header} />
        <${Teaser} />
        <${Abstract} />
        <${Method} />
        <${Results} />
        <${Videos} />
        <${References} />
        <${Footer} />
      <//>
    `;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
})();
