'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addTodo } from '@/app/actions/todos'

export default function AddTodoForm() {
  const [state, action, pending] = useActionState(addTodo, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && state.error === null) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-4">
      <form ref={formRef} action={action} className="flex gap-3">
        <input
          name="title"
          type="text"
          placeholder="Ajouter une nouvelle tâche…"
          required
          autoFocus
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {pending ? '…' : 'Ajouter'}
        </button>
      </form>
      {state?.error && (
        <p className="mt-2 text-xs text-red-600 px-1">{state.error}</p>
      )}
    </div>
  )
}
