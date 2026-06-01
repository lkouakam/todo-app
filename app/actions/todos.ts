'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function addTodo(_: unknown, formData: FormData) {
  const titre = (formData.get('title') as string)?.trim()
  if (!titre) return { error: 'Le titre ne peut pas être vide.' }

  const date_echeance = (formData.get('date_echeance') as string) || null
  const priorite = (formData.get('priorite') as string) || null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('todos')
    .insert({ titre, user_id: user.id, termine: false, date_echeance, priorite })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { error: null }
}

export async function toggleTodo(id: string, termine: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('todos').update({ termine: !termine }).eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
}

export async function deleteTodo(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('todos').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
}
