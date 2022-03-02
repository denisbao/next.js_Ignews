import { render, screen } from '@testing-library/react'
import { Header } from '.'

// Mock que o jest deve criar para a importação 'next/router', definindo qual deve
// ser o retorno para o método 'useRouter()' que o componente ActiveLink usa na aplicação
jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})


describe('Header Component', () => {

  it('renders correctly', () => {
    render( 
      <Header />
    )
  
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })

})

