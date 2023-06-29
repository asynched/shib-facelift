import { useForm } from '@/hooks/common'
import {
  login,
  saveTokenToLocalStorage,
  setAuthToken,
} from '@/services/api/auth'
import { preventDefault } from '@/utils/ui'
import { toast } from 'react-toastify'

type LoginModalProps = {
  onLogin: (token: string) => unknown
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [form, register] = useForm({
    username: '',
    password: '',
  })

  const handleLogin = async () => {
    try {
      const data = await login(form)

      saveTokenToLocalStorage(data.token)
      setAuthToken(data.token)
      onLogin(data.token)

      toast.success('Logged in!')
    } catch (err) {
      toast.error('Invalid credentials (HTTP 401)')
    }
  }

  return (
    <>
      <img
        src="/login-backdrop.svg"
        className="w-full h-screen object-cover opacity-10"
      />
      <div className="fixed top-0 left-0 w-full h-screen grid place-items-center backdrop-blur-sm">
        <div className="border border-zinc-800 p-8 text-white rounded-lg flex flex-col max-w-[24rem] w-full bg-zinc-900">
          <h1 className="text-center text-4xl font-bold tracking-tighter bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent">
            New shib
          </h1>
          <p className="mb-4 text-center">Query your hive!</p>
          <form onSubmit={preventDefault(handleLogin)} className="grid gap-4">
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Your username"
                className="py-2 px-4 bg-transparent border border-zinc-700 bg-zinc-800 rounded outline-none transition ease-in-out focus:border-transparent focus:ring-2 focus:ring-orange-500"
                {...register('username')}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                className="py-2 px-4 bg-transparent border border-zinc-700 bg-zinc-800 rounded outline-none transition ease-in-out focus:border-transparent focus:ring-2 focus:ring-orange-500"
                {...register('password')}
              />
            </div>
            <button
              type="submit"
              className="mt-2 py-2 px-4 bg-gradient-to-br from-orange-500 to-pink-600 rounded font-medium transition ease-in-out hover:shadow-lg hover:shadow-pink-600/25"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
