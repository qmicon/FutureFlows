import "tailwindcss/tailwind.css";
import { DataProvider } from "../../contexts/DataContext";
import "../styles/globals.css";
import {QueryClientProvider, QueryClient} from 'react-query'
import { SessionProvider } from "next-auth/react"

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider
      session={pageProps.session}
    >
      <Component {...pageProps} />
    </SessionProvider>
  )
}