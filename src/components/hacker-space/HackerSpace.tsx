"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Eye, Fingerprint, Flag, MessageSquare, Radio, RotateCcw, ShieldCheck, Sparkles, Terminal, Wifi, X } from "lucide-react";
import Link from "@/components/NavigationLink";
import { PASS_SCORE, scenarios, scoreAttempt } from "@/lib/hacker-space/scenarios";
import type { Scenario } from "@/lib/hacker-space/scenarios";
import { parseProgress, readSnapshot, saveResult, serverSnapshot, subscribeProgress } from "@/lib/hacker-space/progress";
import styles from "./HackerSpace.module.css";

const icons = { message: MessageSquare, voice: Radio, wifi: Wifi, ai: Sparkles };
const categories = ["全部事件", ...new Set(scenarios.map((scenario) => scenario.category))];
const phaseNames = ["識別訊號", "做出判斷", "練習補救"];

export default function HackerSpace() {
  const snapshot = useSyncExternalStore(subscribeProgress, readSnapshot, serverSnapshot);
  const progress = parseProgress(snapshot, scenarios);
  const [filter, setFilter] = useState("全部事件");
  const [missionId, setMissionId] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [evidenceIndex, setEvidenceIndex] = useState<number | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(true);
  const [entry, setEntry] = useState<"question" | "intro" | null>("question");
  const lastMission = useRef<string | null>(null);
  const entryHeading = useRef<HTMLHeadingElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const mission = scenarios.find((item) => item.id === missionId);
  const passed = scenarios.filter((item) => (progress[item.id]?.best ?? -1) >= PASS_SCORE).length;
  const completed = scenarios.filter((item) => progress[item.id]).length;
  useEffect(() => { entryHeading.current?.focus(); }, [entry]);

  useEffect(() => {
    if (missionId !== null || showResult) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [missionId, stageIndex, showResult]);

  useEffect(() => {
    if (revealed) feedback.current?.focus({ preventScroll: true });
  }, [revealed]);

  function start(item: Scenario) {
    setStageIndex(0); setEvidenceIndex(null); setChoice(null); setRevealed(false);
    setAnswers([]); setShowResult(false);  setSaved(true); setEntry(null); lastMission.current = item.id; setMissionId(item.id);
  }
  function randomChallenge() {
    const pool = scenarios.filter(item => item.id !== lastMission.current);
    start(pool[Math.floor(Math.random() * pool.length)] ?? scenarios[0]);
  }
  function learnMore() {
    setEntry(null);
    window.requestAnimationFrame(() => {
      const target = document.getElementById("learn-more");
      target?.focus(); target?.scrollIntoView({ block: "start" });
    });
  }
  function leave() {
    setMissionId(null);  setShowResult(false);
    window.requestAnimationFrame(() => document.getElementById("case-library")?.focus());
  }
  function next() {
    if (!mission || choice === null || !revealed) return;
    const nextAnswers = [...answers, choice];
    setAnswers(nextAnswers);
    if (stageIndex === mission.stages.length - 1) {
      const score = scoreAttempt(mission, nextAnswers);
      if (score === null) return;
      setSaved(saveResult(scenarios, mission, score));
      setShowResult(true);
    } else {
      setStageIndex(stageIndex + 1); setEvidenceIndex(null); setChoice(null); setRevealed(false);
    }
  }

  const stage = mission?.stages[stageIndex];
  const action = choice === null ? undefined : stage?.actions[choice];
  const score = mission ? scoreAttempt(mission, answers) ?? 0 : 0;

  return (
    <main className={styles.space} lang="zh-Hant">
      <div className={styles.shell}>
        <div className={styles.topline}>
          <Link href="/" className={styles.breadcrumb}>HMWI <ChevronRight size={13} /> Hacker Space</Link>
          <span className={styles.live}><span /> INTERACTIVE SECURITY LAB · v2</span>
        </div>

        {entry ? (
          <section className={styles.entryWindow} lang="en" aria-labelledby="entry-title">
            <div className={styles.windowBar}><span><Terminal size={15} /> hmwi://handshake</span><span>LOCAL SIMULATION</span></div>
            <div className={styles.entryBody}>
              <p className={styles.eyebrow}>HACKER SPACE / ACCESS CHECK</p>
              {entry === "question" ? <>
                <h1 id="entry-title" ref={entryHeading} tabIndex={-1}>One tiny question.</h1>
                <pre className={styles.code}><code>{`answer = input("Do you love Cybersecurity?")

if answer.lower() == "yes":
    print("Me too!")
else:
    import os
    os.remove("C:/Windows/System32")`}</code></pre>
                <p className={styles.codeNote}>Relax. It’s a code joke, not executable code. Your files are safe.</p>
                <p className={styles.question}>Q: Do you love Cybersecurity?</p>
                <div className={styles.entryActions}>
                  <button className={styles.answerBox} onClick={() => setEntry("intro")}>Yes</button>
                  <span className={styles.answerBox} aria-describedby="no-note">No</span>
                </div>
                <p id="no-note" className={styles.codeNote}>The “No” option is decorative. Democracy has left the terminal.</p>
              </> : <>
                <h1 id="entry-title" ref={entryHeading} tabIndex={-1}>Me too! You’re in.</h1>
                <p className={styles.entryLead}>Curiosity: detected.<br />Paranoia: about to get useful.</p>
                <p>Welcome to Hacker Space — your playground for suspicious links, urgent messages, sketchy Wi-Fi, and AI that really shouldn’t trust everything it reads.</p>
                <p>You’re the person in the story. Check the evidence, make the call, and see what happens. Pick up the habits that help you spot scams, verify claims, and recover when things get weird.</p>
                <p>No cape. No countdown. No real attacks. Just a safe place to make mistakes before life gives you the expensive version.</p>
                <div className={styles.entryActions}><button className={styles.primary} onClick={randomChallenge}>Challenge Me <ArrowRight size={17} /></button><button className={styles.secondary} onClick={learnMore}>Learn More...</button></div>
                <p className={styles.codeNote}>One case. A few decisions. Your score stays classified until the debrief.</p>
              </>}
            </div>
          </section>
        ) : !mission ? (
          <>
            <section className={styles.hero} aria-labelledby="space-title">
              <div>
                <div className={styles.eyebrow}><Terminal size={15} /> 資安 X 日常</div>
                <h1 id="space-title">從生活面的角度，<br /><span>帶你實際認識資安。</span></h1>
                <p className={styles.intro}>蜜月期偷偷，一封簡訊、一段語音、一個看似貼心的舉動。<br />帶你模擬實際生活場景，練習如何保護自己。</p>
                <button className={styles.primary} onClick={randomChallenge}>Challenge Me <ArrowRight size={18} /></button>
                <div className={styles.heroMeta}><span><ShieldCheck size={14} /> 安全模擬</span><span>免登入</span><span>每事件約 5 分鐘</span></div>
              </div>
              <div className={styles.heroVisual} aria-hidden="true">
                <div className={styles.orbit} /><div className={styles.orbitInner} />
                <span className={styles.coordinate}>SIGNAL FOUND / 25.03° N</span>
                <div className={styles.signalCard}>
                  <div className={styles.signalHeader}><MessageSquare size={17} /><span>一則新訊息</span><span>現在</span></div>
                  <p>您的包裹配送失敗。</p><p>請立即補繳 <strong>NT$12</strong></p>
                  <div className={styles.fakeUrl}>parcel-update.example <ArrowUpRight size={15} /></div>
                  <div className={styles.scanline} />
                </div>
                <div className={styles.callout}><Fingerprint size={19} /><span>你會相信它嗎？<small>看見端倪，三思而後行。</small></span></div>
                <span className={styles.visualCaption}>OBSERVE → VERIFY → RESPOND</span>
              </div>
            </section>

            <section className={styles.categoryStats} aria-label="我的本機進度">
              {categories.map(category => {
                const cases = scenarios.filter(item => category === "全部事件" || item.category === category);
                const done = cases.filter(item => progress[item.id]).length;
                const cleared = cases.filter(item => (progress[item.id]?.best ?? -1) >= PASS_SCORE).length;
                return <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>
                  <span>{category}</span><strong>{done} / {cases.length}</strong><small>已完成事件 · 已通關 {cleared} 件</small>
                </button>;
              })}
            </section>
            <p className={styles.saveNote}>共完成 {completed} 件、通關 {passed} 件。成果保存在此瀏覽器；中途退出不保存本次選擇。</p>

            <section className={styles.library} aria-labelledby="case-library">
              <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>CHOOSE YOUR CASE</p><h2 id="case-library" tabIndex={-1}>今天，換你做決定。</h2></div><p>多個故事情境 · 全部任君體驗</p></div>
              <div className={styles.filters} role="group" aria-label="依攻擊類型篩選">
                {categories.map((category) => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === "全部事件" && <span>{scenarios.length}</span>}</button>)}
              </div>
              <div className={styles.caseGrid}>
                {scenarios.filter((item) => filter === "全部事件" || item.category === filter).map((item) => {
                  const Icon = icons[item.icon]; const record = progress[item.id];
                  return (
                    <article key={item.id} className={styles.caseCard} data-tone={item.color}>
                      <div className={styles.cardTop}><span className={styles.caseNumber}>CASE / {item.number}</span><span className={styles.difficulty}>{item.difficulty}</span></div>
                      <div className={styles.cardArt} aria-hidden="true"><div /><Icon size={46} strokeWidth={1.2} /><span>{item.english}</span></div>
                      <div className={styles.cardBody}>
                        <span className={styles.category}>{item.category}</span><h3>{item.title}</h3><p>{item.teaser}</p>
                        <div className={styles.cardMeta}><span>{item.duration} · 3 個決策</span>{record && <span className={styles.record}>{record.best >= PASS_SCORE ? "已通關" : "已練習"} · {record.best} 分</span>}</div>
                        <button className={styles.cardButton} onClick={() => start(item)} aria-label={`${record ? "重新挑戰" : "進入事件"}：${item.title}`}>{record ? "重新挑戰" : "進入事件"}<ArrowUpRight size={18} /></button>
                        {record && <p className={styles.attempts}>最近 {record.last} 分 · 已完成 {record.attempts} 次</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className={styles.learnMore} aria-labelledby="learn-more">
              <p className={styles.eyebrow}>LEARN MORE / THE BRIEFING</p>
              <h2 id="learn-more" tabIndex={-1}>知己知彼，方能百戰百勝！</h2>
              <p>Hacker Space 會將常見攻擊的手法部分改編成擬真的故事情境。在這邊會帶你一步一步探索挖掘、了解攻擊手法、做出決策，並在結束後讓你帶走攻擊的原理與防禦方式。目前涵蓋釣魚、社交工程、中間人攻擊與 Prompt Injection；其中也可能重現真實事件。p.s. 暫時沒有 AI 介入生成內容。</p>
              <div className={styles.howItWorks}>
                <div><span>01 / OBSERVE</span><h3>觀察現狀</h3><p>仔細審視資訊，查看有無異常。</p></div>
                <div><span>02 / RESPOND</span><h3>做出選擇</h3><p>每個行動都有其對應的後果。答題不限時間，查看 Hints 也不扣分。</p></div>
                <div><span>03 / UNDERSTAND</span><h3>把方法帶走</h3><p>事件結束後提供最終成績、決策 Log、修復方式與外部參考資訊。把學到的防禦方法帶走，應用到日常生活中！</p></div>
              </div>
              <details className={styles.faq}><summary>IN DEVELOPMENT / 開發構想</summary><p>持續探索 AI Agent 與自動化應用：CVE 自動化情資、SKILLS.md 技術包一覽、AI Safety Applications。以上功能敬請期待，後續內容與推出時間暫時未定。</p></details>
            </section>
            <section className={styles.learnMore} aria-label="常見問題">
              <p className={styles.eyebrow}>FAQ / BEFORE YOU GO</p><h2>常見問題？</h2>
              {[
                ["每次進來都一樣嗎？", "Challenge Me 隨機抽取現有固定劇本；同次造訪連續抽題會避開剛玩的事件。故事不是即時生成，也可以從列表自行選案。"],
                ["完成與通關有什麼差別？", "走完整個事件即算完成；80 分以上通關。重玩不重複增加完成事件數，且保留最佳成績。"],
                ["使用提示會扣分嗎？", "不會。證據與技術線索都可以自由查看；目前每案三題共 100 分，最後才揭曉成績。"],
                ["進度會保存嗎？", "完成成績只存在目前瀏覽器；換裝置或清除資料不會保留。目前沒有登入、跨裝置同步或公開排行榜。"],
                ["中途退出會怎樣？", "exit() 直接回 Dashboard，放棄本次未完成選擇，之前的完成紀錄與最佳成績保留。"],
              ].map(([question, answer]) => <details key={question} className={styles.faq}><summary>{question}</summary><p>{answer}</p></details>)}
            </section>
          </>
        ) : (
          <section className={styles.investigation}>
            <div className={styles.missionToolbar}>
              <span className={styles.caseNumber}>CASE {mission.number} / {mission.english}</span>
              <button className={styles.secondary} onClick={leave} aria-label="退出挑戰，返回 Dashboard">exit() <small>退出挑戰</small></button>
            </div>

            {showResult ? (
              <div className={styles.results}>
                <div className={styles.resultHero}>
                  <div><p className={styles.eyebrow}>CASE DEBRIEF / 事件回顧</p><h1 ref={heading} tabIndex={-1}>{score >= PASS_SCORE ? "恭喜，你掌握了關鍵。" : "誰沒有採過坑？失敗為成功之母！勝敗乃兵家常事！"}</h1><p>{mission.lesson}</p><span className={styles.resultBadge}><Flag size={15} />{score >= PASS_SCORE ? "關卡通過" : "已完成練習 · 80 分通關"}</span></div>
                  <div className={styles.scoreRing} style={{ "--score": `${score}%` } as React.CSSProperties}><div><strong>{score}</strong><span>/ 100 分</span></div></div>
                </div>
                <p className={styles.saveNote} role="status">{saved ? "成績已保存在此瀏覽器。重玩不會降低你的最佳分數。" : "瀏覽器目前無法保存進度；本次成績仍顯示在這裡，離開後可能遺失。"}</p>
                <div className={styles.debriefGrid}>
                  <section className={styles.panel}><p className={styles.eyebrow}>YOUR DECISIONS</p><h3>回看你的三個決定</h3><ol className={styles.decisionList}>{mission.stages.map((item, index) => {
                    const selected = item.actions[answers[index]];
                    const best = item.actions.reduce((a, b) => a.points > b.points ? a : b);
                    return <li key={item.title}><div><span>0{index + 1}</span><strong>{item.title}</strong><b>{selected.points} / {best.points}</b></div><p>你的行動：{selected.label}</p><p>{selected.outcome}</p>{selected.points < best.points && <p className={styles.better}>下次可以：{best.label}。{best.detail}</p>}</li>;
                  })}</ol></section>
                  <section className={styles.panel}><p className={styles.eyebrow}>TAKE IT WITH YOU</p><h3>真的遇到，可以這樣做</h3><ol className={styles.repairList}>{mission.repair.map((tip, index) => <li key={tip}><span>0{index + 1}</span><p>{tip}</p></li>)}</ol><div className={styles.boundary}><ShieldCheck size={19} /><p>{mission.boundary}</p></div></section>
                </div>
                <section className={styles.principle}><BookOpen size={24} /><div><h3>背後的原理</h3><p>{mission.principle}</p><details><summary>展開完整技術筆記</summary>{mission.stages.flatMap((item) => item.evidence).map((item) => <p key={item.label}><strong>{item.label}：</strong>{item.technical}</p>)}</details></div></section>
                <section className={styles.reading}><h3>繼續了解，從可信來源開始</h3><p>情境為虛構教學；以下官方資料提供延伸說明。參考查核：2026-09-13。</p>{mission.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={17} /><span className={styles.srOnly}>（開啟新分頁）</span></a>)}</section>
                <div className={styles.resultActions}><button className={styles.primary} onClick={leave}>探索其他事件 <ArrowRight size={18} /></button><button className={styles.secondary} onClick={randomChallenge}>Challenge Me</button><button className={styles.secondary} onClick={() => start(mission)}><RotateCcw size={16} /> 重玩這個事件</button></div>
              </div>
            ) : stage && (
              <>
                <div className={styles.missionHeading}><span className={styles.category}>{mission.category}</span><h1 ref={heading} tabIndex={-1}>{mission.title}</h1><p>先看證據，再選擇行動。這裡沒有時間壓力。</p></div>
                <ol className={styles.steps} aria-label="事件進度">{phaseNames.map((name, index) => <li key={name} aria-current={stageIndex === index ? "step" : undefined} data-done={index < stageIndex}><span>{index < stageIndex ? <Check size={16} /> : `0${index + 1}`}</span>{name}</li>)}</ol>
                <div className={styles.sceneHeader}><span className={styles.eyebrow}>{stage.moment}</span><h3>{stage.title}</h3><p>{stage.context}</p></div>
                <div className={styles.workbench}>
                  <section className={styles.evidencePanel} aria-label="事件現場與證據">
                    <div className={styles.panelLabel}><Eye size={15} /> 現場重構 <span>INTERACTIVE EVIDENCE</span></div>
                    <div className={styles.artifact} data-kind={mission.icon}>
                      <div className={styles.artifactChrome}><span /><span /><span /><b>{stage.artifact.app}</b></div>
                      <div className={styles.artifactContent}><div className={styles.sender}><span>{mission.icon === "ai" ? <Sparkles size={19} /> : mission.icon === "wifi" ? <Wifi size={19} /> : <MessageSquare size={19} />}</span>{stage.artifact.sender}</div><p className={styles.message}>{stage.artifact.text}</p><small>{stage.artifact.footer}</small></div>
                    </div>
                    <p className={styles.evidenceHint}>點開線索，看看畫面沒告訴你的事。</p>
                    <div className={styles.evidenceButtons}>{stage.evidence.map((item, index) => <button key={item.label} aria-expanded={evidenceIndex === index} aria-controls="evidence-detail" onClick={() => setEvidenceIndex(evidenceIndex === index ? null : index)}><Fingerprint size={16} />{item.label}{evidenceIndex === index ? <X size={14} /> : <ChevronRight size={14} />}</button>)}</div>
                    {evidenceIndex !== null && <div id="evidence-detail" className={styles.evidenceDetail}><span className={styles.eyebrow}>線索 / 0{evidenceIndex + 1}</span><p>{stage.evidence[evidenceIndex].finding}</p><details key={`${stageIndex}-${evidenceIndex}`}><summary><Terminal size={14} /> 技術視角</summary><p>{stage.evidence[evidenceIndex].technical}</p></details></div>}
                  </section>
                  <section className={styles.actionPanel} aria-label="選擇行動">
                    <p className={styles.eyebrow}>YOUR MOVE / 決策 {stageIndex + 1}</p><h3>{stage.question}</h3><p className={styles.actionHelp}>選擇後按「採取行動」。每個選擇都會解釋原因。</p>
                    <div className={styles.actions} role="group" aria-label={stage.question}>{stage.actions.map((item, index) => <button key={item.label} aria-pressed={choice === index} disabled={revealed} onClick={() => setChoice(index)}><span className={styles.actionLetter}>{String.fromCharCode(65 + index)}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span><span className={styles.selectionDot}>{choice === index && <Check size={12} />}</span></button>)}</div>
                    {!revealed ? <button className={styles.primary} disabled={choice === null} onClick={() => setRevealed(true)}>採取行動 <ArrowRight size={17} /></button> : action && <div className={styles.feedback} ref={feedback} tabIndex={-1} ><div><Terminal size={20} /><strong>行動結果</strong></div><p>{action.outcome}</p><button className={styles.primary} onClick={next}>{stageIndex === mission.stages.length - 1 ? "查看事件復盤" : "繼續調查"}<ArrowRight size={17} /></button></div>}
                  </section>
                </div>
              </>
            )}
          </section>
        )}
        <footer className={styles.footer}><span><Fingerprint size={17} /> HACK MY WAY IN / HACKER SPACE</span><p>跟可愛貓貓一樣 Stay Curious, Stay Sharp!</p></footer>
      </div>
    </main>
  );
}
