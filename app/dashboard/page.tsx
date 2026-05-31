import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { toggleTodo, deleteTodo } from '@/app/actions/todos'
import AddTodoForm from './AddTodoForm'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: todos, error } = await supabase
    .from('todos')
    .select('id, titre, termine, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Supabase error:', error.message)

  const done = todos?.filter((t) => t.termine).length ?? 0
  const total = todos?.length ?? 0
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-400 truncate max-w-[180px]">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-5">

        {/* Stats */}
        {total > 0 && (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-700">Progression</p>
              <span className="text-sm font-bold text-violet-600">{done}/{total} terminée{done > 1 ? 's' : ''}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Add form */}
        <AddTodoForm />

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {total === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Aucune tâche</p>
                <p className="text-xs text-slate-400 mt-0.5">Ajoutez votre première tâche ci-dessus.</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todos!.map((todo) => {
                const toggle = toggleTodo.bind(null, todo.id, todo.termine)
                const remove = deleteTodo.bind(null, todo.id)

                return (
                  <li key={todo.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors group">

                    {/* Checkbox */}
                    <form action={toggle}>
                      <button
                        type="submit"
                        aria-label={todo.termine ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          todo.termine
                            ? 'bg-violet-600 border-violet-600 shadow-sm'
                            : 'border-slate-300 hover:border-violet-400 hover:bg-violet-50'
                        }`}
                      >
                        {todo.termine && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </form>

                    {/* Title */}
                    <span className={`flex-1 text-sm leading-relaxed ${
                      todo.termine
                        ? 'line-through text-slate-400'
                        : 'text-slate-800'
                    }`}>
                      {todo.titre}
                    </span>

                    {/* Delete */}
                    <form action={remove}>
                      <button
                        type="submit"
                        aria-label="Supprimer"
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </form>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </main>
    </div>
  )
}
