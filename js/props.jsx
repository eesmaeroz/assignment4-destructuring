// Meryem Esma Eröz, 2200005798
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
// My data: cards for courses and notices on a student dashboard.
import { renderToStaticMarkup } from 'react-dom/server'

const show = (label, element) => {
  try {
    console.log(label, renderToStaticMarkup(element))
  } catch (error) {
    console.log(label, 'THROWS', error.constructor.name, '-', error.message.split('\n')[0])
  }
}

// ---------------------------------------------------------------------------
// P1: props is ONE object. These two components are the same thing.
function CourseCardA(props) {
  console.log('P1 props object:', props)
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CourseCardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
show('P1 A:', <CourseCardA title="SEN0415">Advanced Web Programming</CourseCardA>)
show('P1 B:', <CourseCardB title="SEN0415">Advanced Web Programming</CourseCardB>)
// what B does, written by hand: form 5 (by name) inside form 11 (pattern in a parameter)
function CourseCardC(props) {
  const { title, children } = props
  return <section><h2>{title}</h2>{children}</section>
}
show('P1 C:', <CourseCardC title="SEN0415">Advanced Web Programming</CourseCardC>)

// ---------------------------------------------------------------------------
// P2: children is only a prop.
show('P2 between tags :', <CourseCardB title="OOP">C++ labs</CourseCardB>)
show('P2 as attribute :', <CourseCardB title="OOP" children="C++ labs" />)
// both at the same time: the content between the tags wins
show('P2 both         :', <CourseCardB title="OOP" children="from attribute">from tags</CourseCardB>)
// what JSX turns into (automatic runtime): one props object with children inside
const element = <CourseCardB title="OOP">C++ labs</CourseCardB>
console.log('P2 element.props:', element.props)

// ---------------------------------------------------------------------------
// P3: what children can be.
function Box({ children }) {
  return <div>[{children}]</div>
}
show('P3 string      :', <Box>Calculus</Box>)
show('P3 number      :', <Box>{4}</Box>)
show('P3 zero        :', <Box>{0}</Box>)
show('P3 one element :', <Box><b>OOP</b></Box>)
show('P3 several     :', <Box><b>OOP</b><i>Calculus</i>text</Box>)
show('P3 array       :', <Box>{['a', 'b', 'c']}</Box>)
show('P3 undefined   :', <Box>{undefined}</Box>)
show('P3 null        :', <Box>{null}</Box>)
show('P3 false       :', <Box>{false}</Box>)
show('P3 true        :', <Box>{true}</Box>)
show('P3 empty string:', <Box>{''}</Box>)
show('P3 no children :', <Box />)
show('P3 function    :', <Box>{() => 'hello'}</Box>)
show('P3 object      :', <Box>{{ course: 'OOP' }}</Box>)
// a function child is useful only when the component CALLS it ("render prop")
function Countdown({ days, children }) {
  return <p>{children(days)}</p>
}
show('P3 function called:', <Countdown days={12}>{(d) => `Final in ${d} days`}</Countdown>)
// how many children? props.children is a single value OR an array
function CountChildren({ children }) {
  return <span>{Array.isArray(children) ? `array of ${children.length}` : typeof children}</span>
}
show('P3 count one:', <CountChildren><b>x</b></CountChildren>)
show('P3 count two:', <CountChildren><b>x</b><b>y</b></CountChildren>)
show('P3 count txt:', <CountChildren>text</CountChildren>)

// ---------------------------------------------------------------------------
// P4: separating children from the other props, and the order of spread.
function Notice({ title, children, ...rest }) {
  console.log('P4 rest has:', Object.keys(rest))
  return (
    <section {...rest}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}
show('P4 rest:', <Notice title="Exam" id="midterm" className="warn" data-week="8">Room A-204</Notice>)
// explicit prop AFTER the spread wins
function NoticeFixedClass({ children, ...rest }) {
  return <section {...rest} className="notice">{children}</section>
}
// explicit prop BEFORE the spread loses
function NoticeDefaultClass({ children, ...rest }) {
  return <section className="notice" {...rest}>{children}</section>
}
show('P4 after  spread:', <NoticeFixedClass className="mine">x</NoticeFixedClass>)
show('P4 before spread:', <NoticeDefaultClass className="mine">x</NoticeDefaultClass>)
show('P4 before, none :', <NoticeDefaultClass>x</NoticeDefaultClass>)
// rest that still contains a name I did not want on the DOM
function LeakyNotice({ children, ...rest }) {
  return <section {...rest}>{children}</section>
}
show('P4 leaky:', <LeakyNotice title="Exam" urgent={true}>x</LeakyNotice>)
// key is not a prop: it is taken by React and never reaches the component
function ShowKey(props) {
  return <span>key is {String(props.key)}; props keys: {Object.keys(props).join(',')}</span>
}
show('P4 key:', <ShowKey key="k1" title="t" />)

// ---------------------------------------------------------------------------
// P5: props or children? The same layout built twice.
function PanelWithProps({ header, footer, body }) {
  return (
    <article>
      <header>{header}</header>
      <main>{body}</main>
      <footer>{footer}</footer>
    </article>
  )
}
function PanelWithChildren({ children }) {
  return <article>{children}</article>
}
show(
  'P5 props   :',
  <PanelWithProps header={<h2>Week 8</h2>} body={<p>Midterm</p>} footer={<small>İKÜ</small>} />,
)
show(
  'P5 children:',
  <PanelWithChildren>
    <header><h2>Week 8</h2></header>
    <main><p>Midterm</p></main>
    <footer><small>İKÜ</small></footer>
  </PanelWithChildren>,
)
// with children only, the caller can forget the footer, or put it first:
show(
  'P5 children, wrong order:',
  <PanelWithChildren>
    <footer><small>İKÜ</small></footer>
    <header><h2>Week 8</h2></header>
  </PanelWithChildren>,
)

// ---------------------------------------------------------------------------
// P6: defaults with form 7.
function Badge({ label = 'no label', count = 0 }) {
  return <span>{label}: {count}</span>
}
show('P6 missing  :', <Badge />)
show('P6 undefined:', <Badge label={undefined} count={undefined} />)
show('P6 null     :', <Badge label={null} count={null} />)
show('P6 given    :', <Badge label="Unread" count={3} />)
function Frame({ children = <em>(empty)</em> }) {
  return <div>{children}</div>
}
show('P6 children default, none:', <Frame />)
show('P6 children default, null:', <Frame>{null}</Frame>)

// ---------------------------------------------------------------------------
// Experiment: a component that changes its props.
function Mutator(props) {
  props.title = 'changed'
  return <span>{props.title}</span>
}
show('mutate props:', <Mutator title="original" />)
function MutateLocal({ title }) {
  title = title.toUpperCase() // only the local variable changes
  return <span>{title}</span>
}
show('mutate local:', <MutateLocal title="original" />)
