// Meryem Esma Eröz, 2200005798
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
// The lines the compiler rejects are in errors/props-errors.tsx (run `npm run errors`).
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const show = (label: string, element: ReactNode): void => {
  console.log(label, renderToStaticMarkup(element))
}

// P1: props is one object; the type goes after the whole pattern.
type CourseCardProps = { title: string; children?: ReactNode }
function CourseCardA(props: CourseCardProps) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CourseCardB({ title, children }: CourseCardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
show('P1 A:', <CourseCardA title="SEN0415">Advanced Web Programming</CourseCardA>)
show('P1 B:', <CourseCardB title="SEN0415">Advanced Web Programming</CourseCardB>)

// P2: children is only a prop, the same type checks both ways of passing it.
show('P2 between tags :', <CourseCardB title="OOP">C++ labs</CourseCardB>)
show('P2 as attribute :', <CourseCardB title="OOP" children="C++ labs" />)

// P3: what ReactNode allows (all of these type-check).
function Box({ children }: { children?: ReactNode }) {
  return <div>[{children}]</div>
}
const allowed: ReactNode[] = ['text', 4, <b key="b">OOP</b>, undefined, null, false]
allowed.forEach((child, i) => show(`P3 [${i}] ${typeof child}:`, <Box>{child}</Box>))
// a function child must be typed as a function, not ReactNode
function Countdown({ days, children }: { days: number; children: (d: number) => ReactNode }) {
  return <p>{children(days)}</p>
}
show('P3 function child:', <Countdown days={12}>{(d) => `Final in ${d} days`}</Countdown>)

// P4: separating children from the rest, typed with ComponentProps<'section'>.
type NoticeProps = ComponentProps<'section'> & { heading: string }
function Notice({ heading, children, ...rest }: NoticeProps) {
  // rest: every <section> attribute except heading and children
  return (
    <section {...rest} className={['notice', rest.className].filter(Boolean).join(' ')}>
      <h3>{heading}</h3>
      {children}
    </section>
  )
}
show('P4:', <Notice heading="Exam" id="midterm" className="warn" aria-live="polite">Room A-204</Notice>)

// P5: props or children, typed.
type PanelProps = { header: ReactNode; body: ReactNode; footer?: ReactNode }
function PanelWithProps({ header, body, footer = <small>İKÜ</small> }: PanelProps) {
  return <article><header>{header}</header><main>{body}</main><footer>{footer}</footer></article>
}
function PanelWithChildren({ children }: PropsWithChildren) {
  return <article>{children}</article>
}
show('P5 props   :', <PanelWithProps header={<h2>Week 8</h2>} body={<p>Midterm</p>} />)
show('P5 children:', <PanelWithChildren><h2>Week 8</h2><p>Midterm</p></PanelWithChildren>)

// P6: defaults. With the default, label is string inside, not string | undefined.
type BadgeProps = { label?: string; count?: number | null }
function Badge({ label = 'no label', count = 0 }: BadgeProps) {
  return <span>{label.toUpperCase()}: {count ?? 'null!'}</span>
}
show('P6 missing  :', <Badge />)
show('P6 undefined:', <Badge label={undefined} count={undefined} />)
show('P6 null     :', <Badge count={null} />)

// P7: the three types.
// children?: ReactNode — written by hand, optional.
type CardOwn = { title: string; children?: ReactNode }
// PropsWithChildren<P> — adds children?: ReactNode to P for me.
type CardHelper = PropsWithChildren<{ title: string }>
// both are the same type:
const sameA: CardOwn = { title: 'x', children: 'y' }
const sameB: CardHelper = sameA
console.log('P7 same shape:', JSON.stringify(sameB))
// ComponentProps<'button'> — every attribute a real <button> accepts.
type SubmitButtonProps = ComponentProps<'button'> & { busy?: boolean }
function SubmitButton({ busy = false, children, disabled, ...rest }: SubmitButtonProps) {
  return (
    <button type="submit" {...rest} disabled={busy || disabled}>
      {busy ? 'Saving…' : children}
    </button>
  )
}
show('P7 button:', <SubmitButton onClick={() => {}} title="save">Save task</SubmitButton>)
show('P7 busy  :', <SubmitButton busy>Save task</SubmitButton>)
// required children: when the component makes no sense without content
type RequiredChildren = { children: ReactNode }
function Required({ children }: RequiredChildren) {
  return <p>{children}</p>
}
show('P7 required children:', <Required>must be here</Required>)
