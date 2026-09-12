"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, CircleCheck, Eye, Fingerprint, Flag, LockKeyhole, MessageSquare, Radio, RotateCcw, ShieldCheck, Sparkles, Terminal, TriangleAlert, Wifi, X } from "lucide-react";
import Link from "@/components/NavigationLink";
import { PASS_SCORE, scenarios, scoreAttempt } from "@/lib/hacker-space/scenarios";
import type { Scenario } from "@/lib/hacker-space/scenarios";
import { parseProgress, readSnapshot, saveResult, serverSnapshot, subscribeProgress } from "@/lib/hacker-space/progress";
import styles from "./HackerSpace.module.css";

const icons = { message: MessageSquare, voice: Radio, wifi: Wifi, ai: Sparkles };
const categories = ["全部事件", ...scenarios.map((scenario) => scenario.category)];
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
  const [confirmExit, setConfirmExit] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const mission = scenarios.find((item) => item.id === missionId);
  const passed = scenarios.filter((item) => (progress[item.id]?.best ?? -1) >= PASS_SCORE).length;
  const completed = scenarios.filter((item) => progress[item.id]).length;
  const bestTotal = scenarios.reduce((sum, item) => sum + (progress[item.id]?.best ?? 0), 0);

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
    setAnswers([]); setShowResult(false); setConfirmExit(false); setSaved(true); setMissionId(item.id);
  }
  function leave() {
    setMissionId(null); setConfirmExit(false); setShowResult(false);
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
  const isOptimalAction = Boolean(action && stage && action.points === Math.max(...stage.actions.map((item) => item.points)));
  const score = mission ? scoreAttempt(mission, answers) ?? 0 : 0;

  return (
    <main className={styles.space} lang="zh-Hant">
      <div className={styles.shell}>
        <div className={styles.topline}>
          <Link href="/" className={styles.breadcrumb}>HMWI <ChevronRight size={13} /> Hacker Space</Link>
          <span className={styles.live}><span /> INTERACTIVE SECURITY LAB · v1</span>
        </div>

        {!mission ? (
          <>
            <section className={styles.hero} aria-labelledby="space-title">
              <div>
                <div className={styles.eyebrow}><Terminal size={15} /> 在生活裡，也能有防禦力</div>
                <h1 id="space-title">先在這裡踩雷。<br /><span>別在生活裡中招。</span></h1>
                <p className={styles.intro}>一封簡訊、一段語音、一個看似貼心的 AI。<br />走進事件現場，找線索、做決定，練習保護自己。</p>
                <button className={styles.primary} onClick={() => start(scenarios[0])}>開始第一個事件 <ArrowRight size={18} /></button>
                <div className={styles.heroMeta}><span><ShieldCheck size={14} /> 安全模擬</span><span>免登入</span><span>每案約 5 分鐘</span></div>
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
                <div className={styles.callout}><Fingerprint size={19} /><span>你會相信它嗎？<small>看見訊號，再做決定。</small></span></div>
                <span className={styles.visualCaption}>OBSERVE → VERIFY → RESPOND</span>
              </div>
            </section>

            <section className={styles.stats} aria-label="我的本機進度">
              <div><span>已通關事件</span><strong>{String(passed).padStart(2, "0")} <small>/ 04</small></strong></div>
              <div><span>最佳分數合計</span><strong>{bestTotal} <small>/ 400</small></strong></div>
              <div><span>完成過的事件</span><strong>{String(completed).padStart(2, "0")} <small>/ 04</small></strong></div>
              <p><LockKeyhole size={17} /><span>你的練習，你的步調。<small>完成成績只存在此瀏覽器，換裝置或清除資料不會保留。</small></span></p>
            </section>

            <section className={styles.library} aria-labelledby="case-library">
              <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>CHOOSE YOUR CASE</p><h2 id="case-library" tabIndex={-1}>今天，換你做決定。</h2></div><p>4 個生活事件 · 全部開放遊玩</p></div>
              <div className={styles.filters} role="group" aria-label="依攻擊類型篩選">
                {categories.map((category) => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === "全部事件" && <span>04</span>}</button>)}
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

            <section className={styles.howItWorks} aria-label="玩法與評分">
              <div><span>01 / OBSERVE</span><h3>先看現場</h3><p>點開證據，別急著下結論。想深入就展開技術視角。</p></div>
              <div><span>02 / RESPOND</span><h3>做出你的選擇</h3><p>每個行動都有後果。沒有倒數計時，查看線索不扣分。</p></div>
              <div><span>03 / UNDERSTAND</span><h3>把方法帶走</h3><p>三題共 100 分，80 分通關。無論分數，都能看完整復盤。</p></div>
            </section>
            <details className={styles.faq}><summary>每次進來都一樣嗎？進度會保存嗎？</summary><p>第一版是四個固定劇本，可自由重玩。每次選擇會得到對應後果與分數；不是隨機生成或即時 AI。每案前兩題各 30 分、補救題 40 分，較完整的處置得分較高。只有完成成績會存到目前瀏覽器，進行中的選擇不會保存；此版本沒有跨裝置同步或公開排行榜。</p></details>
          </>
        ) : (
          <section className={styles.investigation}>
            <div className={styles.missionToolbar}>
              <button className={styles.back} onClick={() => showResult ? leave() : setConfirmExit(true)}>← 事件列表</button>
              <span className={styles.caseNumber}>CASE {mission.number} / {mission.english}</span>
              <span className={styles.simulation}>模擬演練</span>
            </div>
            {confirmExit && <div className={styles.exitNotice} role="alert"><p>回到列表會放棄本次未完成的選擇，之前的最佳成績會保留。</p><div><button className={styles.secondary} onClick={() => setConfirmExit(false)}>繼續調查</button><button className={styles.secondary} onClick={leave}>離開這次練習</button></div></div>}

            {showResult ? (
              <div className={styles.results}>
                <div className={styles.resultHero}>
                  <div><p className={styles.eyebrow}>CASE DEBRIEF / 事件復盤</p><h1 ref={heading} tabIndex={-1}>{score >= PASS_SCORE ? "這次，你守住了關鍵。" : "踩過的雷，變成下一次的直覺。"}</h1><p>{mission.lesson}</p><span className={styles.resultBadge}><Flag size={15} />{score >= PASS_SCORE ? "關卡通過" : "已完成練習 · 80 分通關"}</span></div>
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
                <div className={styles.resultActions}><button className={styles.primary} onClick={leave}>探索其他事件 <ArrowRight size={18} /></button><button className={styles.secondary} onClick={() => start(mission)}><RotateCcw size={16} /> 重玩這個事件</button></div>
              </div>
            ) : stage && (
              <>
                <div className={styles.missionHeading}><span className={styles.category}>{mission.category}</span><h1 ref={heading} tabIndex={-1}>{mission.title}</h1><p>先看證據，再選擇行動。這裡沒有時間壓力。</p></div>
                <ol className={styles.steps} aria-label="事件進度">{phaseNames.map((name, index) => <li key={name} aria-current={stageIndex === index ? "step" : undefined} data-done={index < stageIndex}><span>{index < stageIndex ? <Check size={16} /> : `0${index + 1}`}</span>{name}</li>)}</ol>
                <div className={styles.sceneHeader}><span className={styles.eyebrow}>{stage.moment}</span><h3>{stage.title}</h3><p>{stage.context}</p></div>
                <div className={styles.workbench}>
                  <section className={styles.evidencePanel} aria-label="事件現場與證據">
                    <div className={styles.panelLabel}><Eye size={15} /> 現場重建 <span>INTERACTIVE EVIDENCE</span></div>
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
                    {!revealed ? <button className={styles.primary} disabled={choice === null} onClick={() => setRevealed(true)}>採取行動 <ArrowRight size={17} /></button> : action && <div className={styles.feedback} ref={feedback} tabIndex={-1} data-success={isOptimalAction}><div>{isOptimalAction ? <CircleCheck size={20} /> : <TriangleAlert size={20} />}<strong>行動結果</strong><span>+{action.points} 分</span></div><p>{action.outcome}</p><button className={styles.primary} onClick={next}>{stageIndex === mission.stages.length - 1 ? "查看事件復盤" : "繼續調查"}<ArrowRight size={17} /></button></div>}
                  </section>
                </div>
              </>
            )}
          </section>
        )}
        <footer className={styles.footer}><span><Fingerprint size={17} /> HACK MY WAY IN / HACKER SPACE</span><p>把好奇心，變成保護自己的能力。</p></footer>
      </div>
    </main>
  );
}
