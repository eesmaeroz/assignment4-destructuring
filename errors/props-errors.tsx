// Meryem Esma Eröz, 2200005798
// JSX the compiler REJECTS on purpose (P7). Not part of `npm run check`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

// E9: a props type without children, but the caller passes content
function TitleOnly({ title }: { title: string }) {
  return <h2>{title}</h2>
}
export const e9 = <TitleOnly title="OOP">some content</TitleOnly>

// E10: children given twice, as an attribute and between the tags
function Card({ title, children }: PropsWithChildren<{ title: string }>) {
  return <section><h2>{title}</h2>{children}</section>
}
export const e10 = <Card title="OOP" children="attribute">tags</Card>

// E11: a plain object is not a ReactNode
export const e11 = <Card title="OOP">{{ course: 'OOP' }}</Card>

// E12: a function is not a ReactNode either (only if the component types it as one)
export const e12 = <Card title="OOP">{() => 'hello'}</Card>

// E13: required children missing
function Required({ children }: { children: ReactNode }) {
  return <p>{children}</p>
}
export const e13 = <Required />

// E14: ComponentProps<'button'> knows which values a real <button> accepts
function Button(props: ComponentProps<'button'>) {
  return <button {...props} />
}
export const e14 = <Button type="banana">Save</Button>

// E15: ComponentProps<'button'> rejects an attribute that does not exist on <button>
export const e15 = <Button href="/tasks">Save</Button>

// E16: reading key from props
function ShowKey(props: { title: string }) {
  return <span>{props.key}</span>
}
export const e16 = <ShowKey key="k1" title="t" />
