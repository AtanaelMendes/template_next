'use client';

import { useState } from 'react';
import Button from '@/components/buttons/Button';
import InputText from '@/components/inputs/InputText';
import InputEmail from '@/components/inputs/InputEmail';
import InputPassword from '@/components/inputs/InputPassword';
import InputNumber from '@/components/inputs/InputNumber';
import InputDate from '@/components/inputs/InputDate';
import DatePicker from '@/components/inputs/DatePicker';
import InputMonth from '@/components/inputs/InputMonth';
import Checkbox from '@/components/inputs/Checkbox';
import Radio from '@/components/inputs/Radio';
import InputFile from '@/components/inputs/InputFile';
import InputTextArea from '@/components/inputs/InputTextArea';
import InputCPF from '@/components/inputs/InputCPF';
import InputPIS from '@/components/inputs/InputPIS';
import InputNIT from '@/components/inputs/InputNIT';
import { Card, CardTitle, CardActions } from '@/components/cards/Card';

export default function DevPage() {
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [monthValue, setMonthValue] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [pisValue, setPisValue] = useState('');
  const [nitValue, setNitValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Documentação de Componentes</h1>
          <p className="text-gray-600">Exemplos de todos os componentes disponíveis</p>
        </div>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🔘 Botões
          </h2>
          <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Button buttonType="primary">Primary</Button>
            </div>
            <div>
              <Button buttonType="secondary">Secondary</Button>
            </div>
            <div>
              <Button buttonType="success">Success</Button>
            </div>
            <div>
              <Button buttonType="danger">Danger</Button>
            </div>
            <div>
              <Button buttonType="warning">Warning</Button>
            </div>
            <div>
              <Button buttonType="primary" outline>Outline</Button>
            </div>
            <div>
              <Button buttonType="primary" pill>Pill</Button>
            </div>
            <div>
              <Button buttonType="primary" size="small">Small</Button>
            </div>
            <div>
              <Button buttonType="primary" block>Block</Button>
            </div>
            <div>
              <Button buttonType="primary" disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Inputs Text Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📝 Inputs de Texto
          </h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputText</label>
              <InputText
                label="Nome"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite seu nome"
                helperText="Campo obrigatório"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputEmail</label>
              <InputEmail
                label="Email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputPassword</label>
              <InputPassword
                label="Senha"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputNumber</label>
              <InputNumber
                label="Número"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputDate</label>
              <InputDate
                label="Data"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputMonth</label>
              <InputMonth
                label="Mês"
                value={monthValue}
                onChange={(e) => setMonthValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputCPF</label>
              <InputCPF
                label="CPF"
                value={cpfValue}
                onChange={(e) => setCpfValue(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputPIS</label>
              <InputPIS
                label="PIS"
                value={pisValue}
                onChange={(e) => setPisValue(e.target.value)}
                placeholder="000.00000.00-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputNIT</label>
              <InputNIT
                label="NIT"
                value={nitValue}
                onChange={(e) => setNitValue(e.target.value)}
                placeholder="000.00000.00-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputTextArea</label>
              <InputTextArea
                label="Descrição"
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
                placeholder="Digite uma descrição..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">InputFile</label>
              <InputFile
                label="Arquivo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DatePicker</label>
              <DatePicker
                label="Selecione uma data"
              />
            </div>
          </div>
        </section>

        {/* Inputs Boolean Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ☑️ Inputs Booleanos
          </h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Checkbox
                label="Checkbox"
                checked={checkboxValue}
                onChange={(e) => setCheckboxValue(e.target.checked)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Radio
                label="Opção 1"
                value="opt1"
                checked={radioValue === 'opt1'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
              <Radio
                label="Opção 2"
                value="opt2"
                checked={radioValue === 'opt2'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
              <Radio
                label="Opção 3"
                value="opt3"
                checked={radioValue === 'opt3'}
                onChange={(e) => setRadioValue(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🎴 Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Base Card */}
            <Card>
              <CardTitle primary>Card Básico</CardTitle>
              <div className="p-4">
                <p className="text-gray-700">Este é um card básico com título primário.</p>
              </div>
              <CardActions>
                <Button buttonType="primary" size="small">Ação</Button>
              </CardActions>
            </Card>

            {/* Card Success */}
            <Card>
              <CardTitle success>Card Success</CardTitle>
              <div className="p-4">
                <p className="text-gray-700">Card com título em verde (success).</p>
              </div>
              <CardActions>
                <Button buttonType="success" size="small">Confirmar</Button>
              </CardActions>
            </Card>

            {/* Card Warning */}
            <Card>
              <CardTitle warning>Card Warning</CardTitle>
              <div className="p-4">
                <p className="text-gray-700">Card com título em amarelo (warning).</p>
              </div>
              <CardActions>
                <Button buttonType="warning" size="small">Aviso</Button>
              </CardActions>
            </Card>

            {/* Card Danger */}
            <Card>
              <CardTitle danger>Card Danger</CardTitle>
              <div className="p-4">
                <p className="text-gray-700">Card com título em vermelho (danger).</p>
              </div>
              <CardActions>
                <Button buttonType="danger" size="small">Deletar</Button>
              </CardActions>
            </Card>

          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>Página de Documentação de Componentes - Desenvolvida para template_next</p>
        </div>
      </div>
    </div>
  );
}
