import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

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


describe('ActiveLink Component', () => {

  it('renders correctly', () => {
    render( 
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  

  it('adds active class if the links is currently active', () => {
    render( 
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
  
    expect(screen.getByText('Home')).toHaveClass('active')
  })

})

