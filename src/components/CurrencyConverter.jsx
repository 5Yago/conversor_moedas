import { useEffect, useState } from 'react';
import './CurrencyConverter.css';
import axios from "axios";

const CurrencyConverter = () => {

// Armazenar estado das moedas
    const [rates, setRates] = useState(null);

// Armazenar a moeda de origem
    const [fromCurrency, setFromCurrency] = useState("USD");

// Armazenar a moeda de destino
    const [ToCurrency, setToCurrency] = useState("EUR");

// Armazenar o valor a ser convertido
    const [amount, setAmount] = useState("1");

// Armazenar o valor convertido
    const [ConvertedAmount, setConvertedAmount] = useState(null);

// Efeito para buscar as taxas de câmbio da API
    useEffect(() => {
        axios
            .get("https://v6.exchangerate-api.com/v6/6814df6c0767064da9d05506/latest/USD")
            .then((response) => {
                setRates(response.data.conversion_rates);    
            })
            .catch((error) => {
                console.log("Deu ruim ao obter dados da API",error);
            });
    }, []);

// Calcular o valor convertido e corrigir Delays (Atrasos)
    useEffect(() => {

        // Verifica se o objeto rates não é nulo ou indefinido
        if(rates) {
            // Obtem a taxa (moeda origem) senão existir atribui 0
            const ratefrom = rates[fromCurrency] || 0;

            // Obtem a taxa (moeda destino) senão existir atribui 0
            const rateTo = rates[ToCurrency] || 0;

            // Calcula o valor convertido, arredonda em 2 casa e
            // armazena o estado "ConvertedAmount"
            setConvertedAmount(((amount / ratefrom) * rateTo).toFixed(2));
        }

        // Este efeito será executado sempre que qualquer um dos itens
        // (amount, rates, fromCurrency, ToCurrency) for atualizado.
        // Isso è conhecido como (Lista de dependências)
    },[amount, rates, fromCurrency, ToCurrency]);

    // Exibi um loading quando está sendo carregado
    // Se rates nulo renderiza (<div>Carregando...</div>)
    if(!rates) {
        return <div>Carregando...</div>
    }
   
  return (
    <div className='converter'>
        <h2>💵 Conversor de moedas 💴</h2>

        <input type="number" placeholder='Digite o valor...'
        value={amount} onChange={(e) => setAmount(e.target.value)}/>
        <span>Selecione as moedas</span>

        {/* Dropdown para selecionar a moeda de origem */}
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {Object.keys(rates).map((currency)=> (
                <option key={currency} value={currency}>
                    {currency}
                </option>
            ))}
        </select>

        <span>para</span>

        {/* Dropdown para selecionar a moeda de destino */}
        <select value={ToCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {Object.keys(rates).map((currency)=> (
                <option key={currency} value={currency}>
                    {currency}
                </option>
            ))}
        </select>

        <h3 className='h3'>{ConvertedAmount} {ToCurrency}</h3>
        <p>{amount} {fromCurrency} valem {ConvertedAmount} {ToCurrency}</p>
    </div>
  )
}

export default CurrencyConverter