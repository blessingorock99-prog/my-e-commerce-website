import { useState } from 'react'

const initialTasks = [
  { id: 1, text: 'Review product catalog', done: true },
  { id: 2, text: 'Update homepage hero', done: false },
  { id: 3, text: 'Add checkout validation', done: false },
  { id: 4, text: 'Publish new launch campaign', done: false },
]

export default function Checklist() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (id:number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task))
  }

  return (
    <section className="section" style={{maxWidth:'760px',margin:'0 auto'}}>
      <div className="section-header">
        <h1 className="section-title">Admin Checklist</h1>
      </div>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:20,padding:'1.5rem'}}>
        {tasks.map(task => (
          <div key={task.id} className="spec-row" style={{cursor:'pointer'}} onClick={()=>toggleTask(task.id)}>
            <span style={{color:task.done?'var(--text)':'var(--muted)',textDecoration:task.done?'line-through':'none'}}>{task.text}</span>
            <span style={{color:task.done?'var(--teal-mid)':'var(--muted)'}}>{task.done?'Done':'Pending'}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
