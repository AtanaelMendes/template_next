'use client';

import { useState } from 'react';
import Button from '@/components/buttons/Button';
import ButtonToggle from '@/components/buttons/ButtonToggle';
import ButtonDropDown from '@/components/buttons/ButtonDropDown';
import ButtonGroup from '@/components/buttons/ButtonGroup';
import ButtonRadioGroup from '@/components/buttons/ButtonRadioGroup';
import FloatActionButton from '@/components/buttons/FloatActionButton';
import FloatActionButtonExpandable from '@/components/buttons/FloatActionButtonExpandable';
import PillsBadge from '@/components/buttons/PillsBadge';
import WhatsappButton from '@/components/buttons/WhatsappButton';
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
import Card from '@/components/cards/Card';
import { CardTitle, CardActions } from '@/components/cards/Card';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto mt-4 border border-gray-700">
    <code>{code}</code>
  </pre>
);

const Section = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary">
      {title}
    </h2>
    {children}
  </div>
);

const ComponentDemo = ({ title, description, code, children }) => (
  <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-4">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {description && <p className="text-blue-100 text-sm mt-1">{description}</p>}
    </div>
    <div className="p-6">
      <div className="mb-4 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center">
        <div className="w-full">
          {children}
        </div>
      </div>
      {code && <CodeBlock code={code} />}
    </div>
  </div>
);

export default function DevPage() {
  const [activeSection, setActiveSection] = useState('buttons');
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
  const [toggleValue, setToggleValue] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('option1');

  const menuItems = [
    { id: 'buttons', label: 'Botões', icon: '🔘' },
    { id: 'inputs', label: 'Inputs', icon: '📝' },
    { id: 'cards', label: 'Cards', icon: '🎴' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl fixed h-full overflow-y-auto border-r border-gray-200">
        <div className="p-6 bg-gradient-to-br from-primary to-blue-700">
          <h1 className="text-2xl font-bold text-white">Component Docs</h1>
          <p className="text-blue-100 text-sm mt-1">template_next</p>
        </div>
        
        <nav className="p-4">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Componentes
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 flex items-center gap-3 ${
                activeSection === item.id
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-8 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 font-semibold">Template Next v1.0</p>
          <p className="text-xs text-gray-500 mt-1">Next.js 16 + React 19</p>
          <p className="text-xs text-gray-500">Tailwind CSS v4</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Buttons Section */}
          {activeSection === 'buttons' && (
            <>
              <Section title="🔘 Botões">
                <ComponentDemo
                  title="Button - Variantes de Cores"
                  description="Botões com diferentes estilos visuais para ações primárias, secundárias, sucesso, perigo e aviso."
                  code={`<Button buttonType="primary">Primary</Button>
<Button buttonType="secondary">Secondary</Button>
<Button buttonType="success">Success</Button>
<Button buttonType="danger">Danger</Button>
<Button buttonType="warning">Warning</Button>
<Button buttonType="ghost">Ghost</Button>`}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button buttonType="primary">Primary</Button>
                    <Button buttonType="secondary">Secondary</Button>
                    <Button buttonType="success">Success</Button>
                    <Button buttonType="danger">Danger</Button>
                    <Button buttonType="warning">Warning</Button>
                    <Button buttonType="ghost">Ghost</Button>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="Button - Estilos Outline"
                  description="Versão outline dos botões, com borda colorida e fundo transparente."
                  code={`<Button buttonType="primary" outline>Primary Outline</Button>
<Button buttonType="success" outline>Success Outline</Button>
<Button buttonType="danger" outline>Danger Outline</Button>`}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button buttonType="primary" outline>Primary Outline</Button>
                    <Button buttonType="secondary" outline>Secondary Outline</Button>
                    <Button buttonType="success" outline>Success Outline</Button>
                    <Button buttonType="danger" outline>Danger Outline</Button>
                    <Button buttonType="warning" outline>Warning Outline</Button>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="Button - Tamanhos"
                  description="Botões em diferentes tamanhos: pequeno, padrão e largo."
                  code={`<Button buttonType="primary" size="small">Small</Button>
<Button buttonType="primary">Default</Button>
<Button buttonType="primary" block>Block (Full Width)</Button>`}
                >
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button buttonType="primary" size="small">Small</Button>
                      <Button buttonType="primary">Default</Button>
                    </div>
                    <Button buttonType="primary" block>Block (Full Width)</Button>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="Button - Formas"
                  description="Botões com diferentes formatos: padrão, pill (arredondado) e square (sem borda arredondada)."
                  code={`<Button buttonType="primary">Default Rounded</Button>
<Button buttonType="primary" pill>Pill Shape</Button>
<Button buttonType="primary" square>Square</Button>`}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button buttonType="primary">Default Rounded</Button>
                    <Button buttonType="primary" pill>Pill Shape</Button>
                    <Button buttonType="primary" square>Square</Button>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="Button - Estados"
                  description="Botões em estados desabilitado e com bordas."
                  code={`<Button buttonType="primary" disabled>Disabled</Button>
<Button buttonType="primary" bordered>With Border</Button>
<Button buttonType="primary" outline bordered>Outline + Border</Button>`}
                >
                  <div className="flex flex-wrap gap-3">
                    <Button buttonType="primary" disabled>Disabled</Button>
                    <Button buttonType="secondary" disabled>Disabled</Button>
                    <Button buttonType="primary" bordered>With Border</Button>
                    <Button buttonType="primary" outline bordered>Outline + Border</Button>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="ButtonToggle"
                  description="Botão com estado on/off, ideal para configurações e preferências."
                  code={`const [toggleValue, setToggleValue] = useState(false);

<ButtonToggle 
  value={toggleValue}
  onChange={setToggleValue}
>
  {toggleValue ? 'Ativado' : 'Desativado'}
</ButtonToggle>`}
                >
                  <div className="flex gap-3 items-center">
                    <ButtonToggle 
                      value={toggleValue}
                      onChange={setToggleValue}
                    >
                      {toggleValue ? 'Ativado ✓' : 'Desativado ✗'}
                    </ButtonToggle>
                    <span className="text-sm text-gray-600">
                      Estado atual: <strong className={toggleValue ? 'text-green-600' : 'text-red-600'}>
                        {toggleValue ? 'ON' : 'OFF'}
                      </strong>
                    </span>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="ButtonDropDown"
                  description="Botão com menu dropdown para múltiplas opções."
                  code={`<ButtonDropDown 
  options={[
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
    { label: 'Opção 3', value: '3' }
  ]}
  onChange={(value) => console.log(value)}
>
  Selecione uma opção
</ButtonDropDown>`}
                >
                  <ButtonDropDown 
                    options={[
                      { label: 'Exportar PDF', value: 'pdf' },
                      { label: 'Exportar Excel', value: 'excel' },
                      { label: 'Exportar CSV', value: 'csv' },
                      { label: 'Imprimir', value: 'print' }
                    ]}
                    onChange={(value) => alert(`Selecionado: ${value}`)}
                  >
                    Exportar Documento
                  </ButtonDropDown>
                </ComponentDemo>

                <ComponentDemo
                  title="ButtonGroup"
                  description="Grupo de botões relacionados visualmente conectados."
                  code={`<ButtonGroup
  options={[
    { label: 'Opção 1', value: 'option1' },
    { label: 'Opção 2', value: 'option2' },
    { label: 'Opção 3', value: 'option3' }
  ]}
  value={selected}
  onChange={setSelected}
/>`}
                >
                  <div className="space-y-3">
                    <ButtonGroup
                      options={[
                        { label: 'Lista', value: 'list' },
                        { label: 'Grade', value: 'grid' },
                        { label: 'Tabela', value: 'table' }
                      ]}
                      value={selectedGroup}
                      onChange={setSelectedGroup}
                    />
                    <p className="text-sm text-gray-600">Selecionado: <strong>{selectedGroup}</strong></p>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="ButtonRadioGroup"
                  description="Grupo de botões com comportamento de radio buttons."
                  code={`<ButtonRadioGroup
  options={[
    { label: 'Diário', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensal', value: 'monthly' }
  ]}
  value={selected}
  onChange={setSelected}
/>`}
                >
                  <div className="space-y-3">
                    <ButtonRadioGroup
                      options={[
                        { label: 'Hoje', value: 'today' },
                        { label: 'Esta Semana', value: 'week' },
                        { label: 'Este Mês', value: 'month' },
                        { label: 'Este Ano', value: 'year' }
                      ]}
                      value={radioValue}
                      onChange={setRadioValue}
                    />
                    <p className="text-sm text-gray-600">Período: <strong>{radioValue || 'Nenhum'}</strong></p>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="FloatActionButton (FAB)"
                  description="Botão flutuante para ação principal, geralmente fixo no canto da tela."
                  code={`<FloatActionButton 
  onClick={() => alert('Adicionar novo item')}
  icon={<span>+</span>}
  position="bottom-right"
/>`}
                >
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-4 font-medium">Exemplo de FAB em posição bottom-right:</p>
                    <FloatActionButton 
                      onClick={() => alert('Clicou no FAB!')}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="FloatActionButtonExpandable"
                  description="Botão flutuante que expande para mostrar múltiplas ações."
                  code={`<FloatActionButtonExpandable
  actions={[
    { label: 'Editar', onClick: () => {} },
    { label: 'Compartilhar', onClick: () => {} },
    { label: 'Deletar', onClick: () => {} }
  ]}
/>`}
                >
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-4 font-medium">Clique no botão + para expandir as opções:</p>
                    <FloatActionButtonExpandable
                      actions={[
                        { label: 'Novo Documento', onClick: () => alert('Novo documento') },
                        { label: 'Nova Pasta', onClick: () => alert('Nova pasta') },
                        { label: 'Upload', onClick: () => alert('Upload') }
                      ]}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="PillsBadge"
                  description="Badges em formato de pílula para tags e status."
                  code={`<PillsBadge type="primary">Primary</PillsBadge>
<PillsBadge type="success">Success</PillsBadge>
<PillsBadge type="danger">Danger</PillsBadge>
<PillsBadge type="warning">Warning</PillsBadge>
<PillsBadge type="default" small>Small</PillsBadge>`}
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      <PillsBadge type="primary">Primary</PillsBadge>
                      <PillsBadge type="primary-dark">Primary Dark</PillsBadge>
                      <PillsBadge type="success">Success</PillsBadge>
                      <PillsBadge type="danger">Danger</PillsBadge>
                      <PillsBadge type="warning">Warning</PillsBadge>
                      <PillsBadge type="warning-dark">Warning Dark</PillsBadge>
                      <PillsBadge type="default">Default</PillsBadge>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-gray-600 mr-2">Tamanho pequeno:</span>
                      <PillsBadge type="primary" small>Small Badge</PillsBadge>
                      <PillsBadge type="success" small>Active</PillsBadge>
                      <PillsBadge type="danger" small>Error</PillsBadge>
                    </div>
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="WhatsappButton"
                  description="Botão estilizado para abrir conversa no WhatsApp."
                  code={`<WhatsappButton 
  phoneNumber="5511999999999"
  message="Olá, gostaria de mais informações"
/>`}
                >
                  <div className="space-y-3">
                    <WhatsappButton 
                      phoneNumber="5511999999999"
                      message="Olá! Vim pela documentação do sistema."
                    >
                      Falar no WhatsApp
                    </WhatsappButton>
                    <p className="text-xs text-gray-500">Abre uma conversa no WhatsApp com mensagem pré-definida</p>
                  </div>
                </ComponentDemo>
              </Section>
            </>
          )}

          {/* Inputs Section */}
          {activeSection === 'inputs' && (
            <>
              <Section title="📝 Inputs">
                <ComponentDemo
                  title="InputText"
                  description="Input de texto básico com validação e estados."
                  code={`<InputText
  label="Nome"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  placeholder="Digite seu nome"
  helperText="Campo obrigatório"
  required
/>`}
                >
                  <div className="max-w-md">
                    <InputText
                      label="Nome Completo"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Digite seu nome"
                      helperText="Campo obrigatório"
                      required
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputEmail"
                  description="Input específico para endereço de e-mail com validação."
                  code={`<InputEmail
  label="Email"
  value={emailValue}
  onChange={(e) => setEmailValue(e.target.value)}
  placeholder="seu@email.com"
/>`}
                >
                  <div className="max-w-md">
                    <InputEmail
                      label="Endereço de Email"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputPassword"
                  description="Input de senha com botão para mostrar/ocultar."
                  code={`<InputPassword
  label="Senha"
  value={passwordValue}
  onChange={(e) => setPasswordValue(e.target.value)}
  placeholder="Digite sua senha"
/>`}
                >
                  <div className="max-w-md">
                    <InputPassword
                      label="Senha"
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      placeholder="Digite sua senha"
                      required
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputNumber"
                  description="Input numérico com incremento/decremento."
                  code={`<InputNumber
  label="Quantidade"
  value={numberValue}
  onChange={(e) => setNumberValue(e.target.value)}
  min={0}
  max={100}
/>`}
                >
                  <div className="max-w-md">
                    <InputNumber
                      label="Quantidade"
                      value={numberValue}
                      onChange={(e) => setNumberValue(e.target.value)}
                      min={0}
                      max={100}
                      placeholder="0"
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputCPF"
                  description="Input formatado para CPF com máscara."
                  code={`<InputCPF
  label="CPF"
  value={cpfValue}
  onChange={(e) => setCpfValue(e.target.value)}
  placeholder="000.000.000-00"
/>`}
                >
                  <div className="max-w-md">
                    <InputCPF
                      label="CPF"
                      value={cpfValue}
                      onChange={(e) => setCpfValue(e.target.value)}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputPIS"
                  description="Input formatado para número PIS."
                  code={`<InputPIS
  label="PIS"
  value={pisValue}
  onChange={(e) => setPisValue(e.target.value)}
/>`}
                >
                  <div className="max-w-md">
                    <InputPIS
                      label="Número PIS"
                      value={pisValue}
                      onChange={(e) => setPisValue(e.target.value)}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputNIT"
                  description="Input formatado para número NIT."
                  code={`<InputNIT
  label="NIT"
  value={nitValue}
  onChange={(e) => setNitValue(e.target.value)}
/>`}
                >
                  <div className="max-w-md">
                    <InputNIT
                      label="Número NIT"
                      value={nitValue}
                      onChange={(e) => setNitValue(e.target.value)}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputDate"
                  description="Input de data nativo."
                  code={`<InputDate
  label="Data de Nascimento"
  value={dateValue}
  onChange={(e) => setDateValue(e.target.value)}
/>`}
                >
                  <div className="max-w-md">
                    <InputDate
                      label="Data de Nascimento"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      required
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="DatePicker"
                  description="Seletor de data customizado com calendário."
                  code={`<DatePicker
  label="Selecione uma Data"
  value={dateValue}
  onChange={setDateValue}
/>`}
                >
                  <div className="max-w-md">
                    <DatePicker
                      label="Selecione uma Data"
                      value={dateValue}
                      onChange={setDateValue}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputMonth"
                  description="Input para seleção de mês e ano."
                  code={`<InputMonth
  label="Mês/Ano"
  value={monthValue}
  onChange={(e) => setMonthValue(e.target.value)}
/>`}
                >
                  <div className="max-w-md">
                    <InputMonth
                      label="Período"
                      value={monthValue}
                      onChange={(e) => setMonthValue(e.target.value)}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputTextArea"
                  description="Área de texto para conteúdo maior."
                  code={`<InputTextArea
  label="Observações"
  value={textAreaValue}
  onChange={(e) => setTextAreaValue(e.target.value)}
  rows={4}
/>`}
                >
                  <div className="max-w-md">
                    <InputTextArea
                      label="Observações"
                      value={textAreaValue}
                      onChange={(e) => setTextAreaValue(e.target.value)}
                      rows={4}
                      placeholder="Digite suas observações aqui..."
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="Checkbox"
                  description="Caixa de seleção para opções múltiplas."
                  code={`<Checkbox
  label="Aceito os termos"
  checked={checkboxValue}
  onChange={(e) => setCheckboxValue(e.target.checked)}
/>`}
                >
                  <div className="space-y-3">
                    <Checkbox
                      label="Aceito os termos e condições"
                      checked={checkboxValue}
                      onChange={(e) => setCheckboxValue(e.target.checked)}
                    />
                    <Checkbox
                      label="Desejo receber novidades por email"
                      checked={false}
                      onChange={() => {}}
                    />
                    <Checkbox
                      label="Opção desabilitada"
                      checked={false}
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="Radio"
                  description="Botão de rádio para seleção única."
                  code={`<Radio
  label="Opção 1"
  name="opcao"
  value="1"
  checked={radioValue === '1'}
  onChange={(e) => setRadioValue(e.target.value)}
/>`}
                >
                  <div className="space-y-3">
                    <Radio
                      label="Opção 1"
                      name="opcao"
                      value="1"
                      checked={radioValue === '1'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    />
                    <Radio
                      label="Opção 2"
                      name="opcao"
                      value="2"
                      checked={radioValue === '2'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    />
                    <Radio
                      label="Opção 3"
                      name="opcao"
                      value="3"
                      checked={radioValue === '3'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    />
                  </div>
                </ComponentDemo>

                <ComponentDemo
                  title="InputFile"
                  description="Input para upload de arquivos."
                  code={`<InputFile
  label="Upload de Arquivo"
  accept=".pdf,.doc,.docx"
  onChange={(e) => console.log(e.target.files)}
/>`}
                >
                  <div className="max-w-md">
                    <InputFile
                      label="Upload de Documento"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => console.log(e.target.files)}
                    />
                  </div>
                </ComponentDemo>
              </Section>
            </>
          )}

          {/* Cards Section */}
          {activeSection === 'cards' && (
            <>
              <Section title="🎴 Cards">
                <ComponentDemo
                  title="Card Básico"
                  description="Card genérico com título e ações."
                  code={`<Card>
  <CardTitle>Título do Card</CardTitle>
  <p>Conteúdo do card aqui...</p>
  <CardActions>
    <Button buttonType="primary">Ação</Button>
  </CardActions>
</Card>`}
                >
                  <Card>
                    <CardTitle>Título do Card</CardTitle>
                    <p className="text-gray-600 my-4">
                      Este é um card básico com título, conteúdo e área de ações.
                      Pode ser usado para diversos propósitos.
                    </p>
                    <CardActions>
                      <Button buttonType="primary" size="small">Ver Mais</Button>
                      <Button buttonType="secondary" size="small" outline>Editar</Button>
                    </CardActions>
                  </Card>
                </ComponentDemo>

                <ComponentDemo
                  title="Card com Variantes de Cor"
                  description="Cards com diferentes cores para destacar informações."
                  code={`<Card>
  <CardTitle color="primary">Primary Card</CardTitle>
  ...
</Card>

<Card>
  <CardTitle color="success">Success Card</CardTitle>
  ...
</Card>`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardTitle color="primary">Informação</CardTitle>
                      <p className="text-gray-600 text-sm my-2">Card com título azul</p>
                    </Card>
                    <Card>
                      <CardTitle color="success">Sucesso</CardTitle>
                      <p className="text-gray-600 text-sm my-2">Card com título verde</p>
                    </Card>
                    <Card>
                      <CardTitle color="warning">Atenção</CardTitle>
                      <p className="text-gray-600 text-sm my-2">Card com título laranja</p>
                    </Card>
                    <Card>
                      <CardTitle color="danger">Erro</CardTitle>
                      <p className="text-gray-600 text-sm my-2">Card com título vermelho</p>
                    </Card>
                  </div>
                </ComponentDemo>

                <div className="mt-8 p-6 bg-blue-50 border-l-4 border-primary rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Cards Específicos de Domínio</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    O projeto também inclui cards especializados para diferentes domínios:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li><strong>CardCompetencia</strong> - Exibe competências e habilidades</li>
                    <li><strong>CardCurso</strong> - Informações de cursos e formação</li>
                    <li><strong>CardEmprego</strong> - Histórico profissional</li>
                    <li><strong>CardIdioma</strong> - Idiomas e níveis de fluência</li>
                    <li><strong>CardPCD</strong> - Informações de PCD</li>
                    <li><strong>CardSoftware</strong> - Conhecimentos em software</li>
                  </ul>
                </div>
              </Section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
