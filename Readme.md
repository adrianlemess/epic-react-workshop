# Epic React Workshop

## React Fundamentals

DOM

- Document -> objeto pai do DOM
- XML e HTML usam DOM
- Node pode ser um element, atributte ou text
- NodeList é uma lista de node
- DOM é uma árvore
- Document é o root do document a ser manipulado e o window representa o browser
- Element herda a interface generica Node

React

- React: responsável por criar os elementos de DOM
- ReactDOM: Responsável por renderizar elementos react no DOM
- Por padrão react trabalha com SyntheticEvents, não são eventos reais, pra pegar o evento real é com o objeto nativeEvent
- Todo array no DOM precisa de um atributo key, que deve ser unico e consistente - Não usar o index do map pois continuara com o mesmo problema - É melhor gerar o id caso n tenha
  JSX
- Sintax sugar pra manipular elementos com React
- HTML based
- Interpoletion
  - Não permite statements, como if ou for
  - Alterna de JSX pra JS código
- Aparentemente passar um JSX pra uma variavel e tentar usar essa variavel como JSX não funciona.
- O Element do JSX precisa ser uma função
- Precisa ser maiusculo um elemento JSX, do contrário ele entende que é um html nromal e o compilador bota a referencia no createElement como string. Quando é maiusculo ele passa a referencia quente da função.
- PropTypes é apenas para desenvolvimento, não vai para o build de produção
- JSX não funciona dentro de uma variavel, a não ser que coloque direto no render

Custom components

- Sempre é bom passar default param pra evitar undefined no DOM
- É uma boa deixar a implementação e estilo pro componente, assim o client não se preocupa com esses detalhes, mas posso expor o style pra usuários avançados

function foo({ className = '' })
Styling

- {{ }} is a combination of interpoletion with JavaScript object

Forms

- event.preventDefault() -> serve pra evitar o comportamento defaul de um evento. No caso do onSubmit é para evitar que a página de refresh
- Pra setar o for="" no label de um input no react a propriedade é: htmlFor
- Podemos controlar o valor de um input programaticamente da seguinte forma:
  - <input onChange={handleChange} value={myInputValue} />
  - Dessa forma o react nunca vai deixar o valor do input ser diferente do myInputValue e com o handleChange podemos ver a sugestão de mudança que o usuário está digitando
  - Essa forma é boa pra mascaras ou validações onde queremos controlar o que o usuário digita
- Se temos um campo que só pode ser lowerCase porque mostrar o erro se podemos evita-lo?
- useRef é um hook que permite passar uma ref={} com um objeto para podermos manipular nosso form
- Se pegarmos o event do onSubmit o target é relacionado aos atributos que tem nele. Por exemplo, pra pegar o primeiro input do form é target[0].value
- Se especificarmos o name ou id no input podemos pegar pelo target.elements.nameInput
- Se passarmos um value e não passarmos o onChange vai dar erro, pra resolver ou passa uma prop readOnly no input ou passa um onChange
- Da pra setar um valor default também com defaultValue

## React hooks

Hooks comuns

useState
useRef
useContext
useReducer
useEffect

a
Array de dependencias

- Sempre verificar a frequencia que uma dependencia ou função muda pra colocarmos no array de dependencias

Como garantir que uma função só é chamada quando o componente é montado?

```
const useSafeDispatch = unsafeDispatch => {
  const isMounted = React.useRef(false)
  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [unsafeDispatch])
  const dispatch = React.useCallback((...args) => {
    if (isMounted.current) {
      unsafeDispatch(...args)
    }
  })
  return dispatch
}
```

ex:

```
  const run = React.useCallback(promise => {
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, [])
```

useState

- É pra lidar com dados que mudam com o tempo.
- Cada vez que um dado muda chama um re-render. Cada vez que muda o state ele chama a função do componente novamente

useEffect

- Serve para lidar com side effect
- É chamado após o dom ter sido atualizado
- Podemos executar código após o componente ter renderizado ou re-renderizado

Lazy load state

- São chamados de lazy initializers (é a primeira coisa a ser executada e não é executado no update)
- Não é uma boa prática setar um estado de um lugar que tenha sideEffect como o localStorage. Podemos setar o state só a primeira vez passando uma callback pra dentro do useState. Isso irá evitar que a cada re-render chame o localStorage e seja um problema de performance
  - Ao invés de:

```
  const [name, setName] = React.useState(
    window.localStorage.getItem('name') || initialName,
  )
```

    - Ficará:

```
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') || initialName,
  )
```

-
- Se apenas setarmos um valor default pro state é mais barato setar direto sem a função do que chamar uma callback

Array dependency
Podemos passar um segundo parâmetro no useEffect que é um array de dependências. Isso fará que o useEffect só seja chamado quando o estado que queremos escutar ou as variaveis sejam alteradas

```
  useEffect(() => {
    console.log('useEffect')
    window.localStorage.setItem('name', name)
  }, [name])
```

- Se passarmos o array de dependencia vazio, ele vai executar o useEffect apenas uma vez.

```
  useEffect(() => {
    console.log('useEffect')
    window.localStorage.setItem('name', name)
  }, [])
```

Custom hook

- Permite encapsular lógicas com outros hooks
- É uma função que utiliza hooks (default ou inclusive outros hooks)
- São pedaços de código reusáveis
- Podemos deixar no hook um parâmetro receber de forma opcional uma function, assim se precisarmos computar o valor de alguma forma faremos só 1x que nem o useState

```
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place (like we do in previous extra credits)
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })
```

- A convenção é que devem startar o nome com useAlgumaCoisa
  ex:

```
function useLocalStorage(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || defaultValue,
  )
  useEffect(() => {
    console.log('useEffect')
    window.localStorage.setItem(key, name)
  }, [name, key])
  return [state, setState]
}
```

useRef

- Cria um objeto com current, é imutável e não irá trigar o re-render do objeto. É bom quando queremos lidar com esse estado e fazer comparing
- É uma forma de manter o estado anterior, sem triggar o handler
- Se printarmos um ref do DOM provavelmente vai ta undefined porque é a primeira vez que renderiza. Só vai ter valor após o DOM ser montado.
- Refs do DOM é importante lidar com ela dentro do useEffect
- Sempre que usamos o DOM diretamente pra ligar com alguma biblioteca feita em Vanilla é importante usarmos o cleanUp no side effect:

```
function Tilt({children}) {
  // 🐨 create a ref here with React.useRef()
  const divRef = React.useRef()
  useEffect(() => {
    const tiltNode = divRef.current
    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    })
    return () => tiltNode.vanillaTilt.destroy()
  }, [])
```

- Serve para manter o tracking de algo e por exemplo se mudar pro useEffect podemos pegar essa mudança e apagar o anterior

```
  const prevKeyRef = React.useRef(key)
  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])
  return [state, setState]
```

Custom hook de localStorage

```
function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place (like we do in previous extra credits)
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })
  const prevKeyRef = React.useRef(key)
  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])
  return [state, setState]
}
```

Lifting state

- Içar o estado para poder compartilhar entre componentes irmãos
- E o contrário disso é colocation. Se eu tenho um estado que é usado só num childComponent n tem porque manter no pai

Ref prop

- Ajuda a acessar o DOM diretamente
- React por padrão utiliza createElement, n é o DOM direto

State

- Mutar state é  ruim
- Ao invés de alterar um state diretamente, fazer [...state]
- Computed values ou derived values ajudam a manter o estate imutável
- Algumas vezes vai ser até mais rápido que state sync porque sincronizar o state faz ter re-render do componente'

Fetch requests e useEffect

- Não podemos retornar nada no useEffect a não ser  cleaup
- Não podemos usar async encima do useEffect porque dai o useEffect retornaria uma promise e não pode retornar nada

useReducer

- Quando tem vários estados que estão constantemente trocando juntos
- Podemos usar também quando queremos separar o estado da lógica de UI do componente

useState x useReducer

- When it's just an independent element of state you're managing: useState
- When one element of your state relies on the value of another element of your state in order to update: useReducer

Quando temos um useReducer com side effect é interessante utilizar lazy init

useCallback()

- É pra evitar que uma mesma função seja recriada a cada re-render
- Da pra passar uma função callback dentro da lista de dependencias do useEffect
- O useCallback serve pra evitar que a função seja re-criada a cada re-render se uma prop dentro dela mudar
- Basicamente ele salva snapshots na memoria pra uma instancia daquela função com determinados parametros, sem precisar executar de novo

Nem sempre useCallback é mais performatico, se ele tem uma dependencia dentro que é alterada a cada re-render, da no mesmo que deixar a função direta a cada re-render, com a diferença que o useCallback bota um overhead de memória alocada encima.

O useCallback não deixa a função com um determinado parâmetro ser desalocada pelo garbage collector.

useMemo

- É parecido com o useCallback mas pra valores dai.
- Se o ganho em performance é muito pequeno pode não valer a pena pela complexidade de código que traz

Performance optimizations are not free. They ALWAYS come with a cost but do NOT always come with a benefit to offset that cost.

No geral é melhor medir primeiro antes de aplicar a otimização, pra ver se realmente vale a pena
https://kentcdodds.com/blog/aha-programming

Quando utilizar useMemo ou useCallback?

1. Referential equality

```
function Foo({bar, baz}) {
2  const options = {bar, baz}
3  React.useEffect(() => {
4    buzz(options)
5  }, [options]) // we want this to re-run if bar or baz change
6  return <div>foobar</div>
7}
8
9function Blub() {
10  return <Foo bar="bar value" baz={3} />
11}
```

The reason this is problematic is because useEffect is going to do a referential equality check on options between every render, and thanks to the way JavaScript works, options will be new every time so when React tests whether options changed between renders it'll always evaluate to true, meaning the useEffect callback will be called after every render rather than only when bar and baz change.

Quando bar ou baz não são valores primitivos se usa useCallback e useMemo

```
function Foo({bar, baz}) {
2  React.useEffect(() => {
3    const options = {bar, baz}
4    buzz(options)
5  }, [bar, baz])
6  return <div>foobar</div>
7}
8
9function Blub() {
10  const bar = React.useCallback(() => {}, [])
11  const baz = React.useMemo(() => [1, 2, 3], [])
12  return <Foo bar={bar} baz={baz} />
13}
```

Assim ele garante que não vai ser feito a cada re-render.

```
function CountButton({onClick, count}) {
2  return <button onClick={onClick}>{count}</button>
3}
4
5function DualCounter() {
6  const [count1, setCount1] = React.useState(0)
7  const increment1 = () => setCount1(c => c + 1)
8
9  const [count2, setCount2] = React.useState(0)
10  const increment2 = () => setCount2(c => c + 1)
11
12  return (
13    <>
14      <CountButton count={count1} onClick={increment1} />
15      <CountButton count={count2} onClick={increment2} />
16    </>
17  )
18}
```

MOST OF THE TIME YOU SHOULD NOT BOTHER OPTIMIZING UNNECESSARY RERENDERS. React is VERY fast and there are so many things I can think of for you to do with your time that would be better than optimizing things like this. In fact, the need to optimize stuff with what I'm about to show you is so rare that I've literally never needed to do it in the 3 years I worked on PayPal products and the even longer time that I've been working with React.

2. Computationally expensive calculations

```
function RenderPrimes({iterations, multiplier}) {
2  const primes = React.useMemo(() => calculatePrimes(iterations, multiplier), [
3    iterations,
4    multiplier,
5  ])
6  return <div>Primes! {primes}</div>
7}
```

The reason this works is because even though you're defining the function to calculate the primes on every render (which is VERY fast), React is only calling that function when the value is needed. On top of that React also stores previous values given the inputs and will return the previous value given the same previous inputs. That's memoization at work.

Prop Drillin ou Pass throught variables

É melhor do que ter que usar escopo globaL, porém conforme a aplicação cresce pode ser bem complicado de lidar

Para resolver esse problema podemos utilizar o useContext

context

Serve para passar estado pra uma arvore de componentes.

É importante ter o Provider englobando o(s) componente(s) que vão ter acesso ao state

useLayoutEffect

Assim como o useEffect, também é usado para lidar com side effect. Porém em 99% dos casos usaremos useEffect, mas em alguns cenários o useLayoutEffect pode dar um boost de performance e usabilidade.

o useEffect é executado após o render garantindo que o painting do browser não será bloqueado. Diferente do class componente onde o didMount e didupdate rodando de forma sincrona. Porém se no eeffect estivermos mutando uma referencia em algum nodo do DOM, então precisamos usar o useLayoutEffect, do contrário teremos flicker durante a mutação do DOM.

É o único momento que usaremos useLayoutEffect

This runs synchronously immediately after React has performed all DOM mutations. This can be useful if you need to make DOM measurements (like getting the scroll position or other styles for an element) and then make DOM mutations or trigger a synchronous re-render by updating state.

This runs synchronously immediately after React has performed all DOM mutations. This can be useful if you need to make DOM measurements (like getting the scroll position or other styles for an element) and then make DOM mutations or trigger a synchronous re-render by updating state.

As far as scheduling, this works the same way as componentDidMount and componentDidUpdate. Your code runs immediately after the DOM has been updated, but before the browser has had a chance to "paint" those changes (the user doesn't actually see the updates until after the browser has repainted).

https://kentcdodds.com/blog/useeffect-vs-uselayouteffect
´

Ele bloqueia e não mostra a atualização intermediária até de fato o re-render com a mudança do DOM ocorrer

No exemplo de um scroll de um chat, ele adicionaria a mensagem primeiro e o scroll depois.

Flicker é um efeito visual que ocorre depois que algo atualiza e não ao mesmo tempo.

Como o diagrama mostra, o layoutEffect ocorre antes que o browser de o paint, isso evita multiplos paint quando modificamos o DOM diretamente com um ref dentro de um effect.

useImperativeHandle: scroll to top/bottom

Esse hook é BEMMMM RARO DE usar
em class based component é possível passar um ref com this.nameRef pra um componente filho. Porém com functional componente isso não é possível

```
function MyInput() {
  const inputRef = React.useRef()
  const focusInput = () => inputRef.current.focus()
  // where do I put the focusInput method??
  return <input ref={inputRef} />
}
```

Isso acima não é possível

Solução:

```
const MyInput = React.forwardRef(function MyInput(props, ref) {
  const inputRef = React.useRef()
  React.useImperativeHandle(ref, () => {
    return {
      focusInput: () => inputRef.current.focus(),
    }
  })
  return <input ref={inputRef} />
})
```

Ele é usado porque o functional component não é uma instância, logo não da pra pegar um ref.current de um functional componente chamando metodos dele

Basicamente permite expor no objeto ref de um functional componente metodos para serem usados por quem precisar pegar o ref do componente.

1 - sobrescrever o funcional component com:

```
MessagesDisplay = React.ForwardRef(MessagesDisplay)
```

Assim o componente MessagesDisplay recebe uma prop ref (ultima prop)

e ai podemos reassignar novas propriedades do ref do componente:

```
  React.useImperativeHandle(ref, () => {
    return {
      scrollToBottom,
      scrollToTop,
    }
  })
```

E o pai do comjponente pode usar assim:

```
  const messageDisplayRef = React.useRef()
```

```
      <MessagesDisplay ref={messageDisplayRef} messages={messages} />
```

```

  const scrollToTop = () => messageDisplayRef.current.scrollToTop()
  const scrollToBottom = () => messageDisplayRef.current.scrollToBottom()
```

useDebugValue

Serve para debugar melhor dentro do React DevTools

Da pra passar direto a string formatada:

```
  React.useDebugValue(`\`${query}\` => ${state}`)
```

Ou passar 2 parâmetros onde o segundo parâmetro é um formatador

```
const formatCountDebugValue = ({initialCount, step}) =>
  `init: ${initialCount}; step: ${step}`

function useCount({initialCount = 0, step = 1} = {}) {
  React.useDebugValue({initialCount, step}, formatCountDebugValue)
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return [count, increment]
}
```

Assim no React DevTools o state fica com um label mais descritivo

Ele não é pra ser usado em componente e sim dentro de custom hooks

USAREMOS o formatDebugValue se por algum motivo precisamos calcular ou computar algum valor  e não queremos fazer isso a cada re-render pois só o desenvolver ira utilizar

## Advanced React Patterns

Compound Components

- Forma flexível e escalavel de criar componentes
- Pensar na API de um componente é bem complicado tentando prever todos os requisitos que podem  nunca chegar. Agora se, criar de uma forma simples e extensiva, vale muito a pena

O componente pai precisa:

```
function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return React.Children.map(children, (child, index) => {
    /* return child clone here */
    return React.cloneElement(child, {
      on,
      toggle,
    })
  })
```

Onde passamos as proprerties de estado pra todos os filhos

```
const ToggleOn = ({on, children}) => {
  console.log(on)
  if (on) {
    return children
  }
  return null
}

const ToggleOff = ({on, children}) => {
  if (!on) {
    return children
  }
  return null
}
```

Suporte a DOM dentro de compound components, conforme abaixo sem dar erro:

```
     <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
```

Solução 1 quando pode ser qualquer elemento aceito

```
return React.Children.map(children, (child, index) => {
    /* return child clone here */
    console.log(child)
    if (typeof child.type === 'string') {
      return child
    }
    return React.cloneElement(child, {
      on,
      toggle,
    })
  })
```

Solução 2: restringir quais filhos podem ter no Toggle

```
const allowedTypes = [ToggleOn, ToggleOff, ToggleButton]
```

```

  return React.Children.map(children, (child, index) => {
    /* return child clone here */
    console.log(child)
    if (allowedTypes.includes(child.type)) {
      return React.cloneElement(child, {
        on,
        toggle,
      })
    }
    return child
  })
```
