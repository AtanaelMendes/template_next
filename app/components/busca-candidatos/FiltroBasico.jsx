import InputText from '@/components/inputs/InputText';
import Select from "@/components/inputs/Select";
import { useBuscaCandidatosContext } from "@/context/BuscaCandidatosContext";
import { format, isValid, parse } from "date-fns";
import { useCallback, useEffect, useState } from 'react';
import Checkbox from "../inputs/Checkbox";
import InputDate from '../inputs/InputDate';
import InputTextArea from "../inputs/InputTextArea";
import Select2Cliente from '../inputs/Select2Cliente';

const FiltroBasico = ({ active }) => {
    const {
        cargos,
        escolaridades,
        filters,
        handleFiltersChange,
        setTextAreaValues,
    } = useBuscaCandidatosContext();
    const [cliente, setCliente] = useState({});
    const dataHoje = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const camposData = ["ultimaAtualizacaoDe", "ultimaAtualizacaoAte", "dataCriacaoDe", "dataCriacaoAte", "dtLimiteRestricao"];

        camposData.forEach((id) => {
            const value = filters[id];
            handleDateChange(id, value);
        });
    }, []);

    useEffect(() => {
        if (filters.cdPessoaClienteRestricao) {
            setCliente({
                value: filters.cdPessoaClienteRestricao,
                label: `${filters.cdPessoaClienteRestricao} - ${filters.nmPessoaClienteRestricao}`,
            });
        }
    }, [filters]);

    const handleTextAreaChange = useCallback((id, value) => {
        setTextAreaValues(prevValues => ({
            ...prevValues,
            [id]: value,
        }));

        handleFiltersChange({ target: { name: id, value, type: 'generic' } });
    }, [handleFiltersChange]);

    const handleGenericChange = (id, value) => {
        handleFiltersChange({ target: { name: id, value: value, type: 'generic' } });
    };

    const handleDateChange = (id, value) => {
        if (!value) return;

        const parsed =
            parse(value, "dd/MM/yyyy", new Date()) ||
            parse(value, "yyyy-MM-dd", new Date());

        const formatted = isValid(parsed) ? format(parsed, "dd/MM/yyyy") : value;

        handleFiltersChange({ target: { name: id, value: formatted } });
    };

    const handleTurnoChange = (id, value) => {
        handleFiltersChange({ target: { name: id, value: value, type: 'turnos' } });
    };

    function renderOptions() {
        if (!cargos || typeof cargos !== 'object' || !Array.isArray(cargos)) return [];
        return cargos.map(cargo => ({
            label: cargo.nmCargo,
            value: cargo.cdCargo
        }));
    }

    const setDadosCliente = (value, label) => {
        handleFiltersChange({ target: { name: 'cdPessoaClienteRestricao', value: value, type: 'generic' } });
        handleFiltersChange({ target: { name: 'nmPessoaClienteRestricao', value: label, type: 'generic' } });

        setCliente({
            value: value,
            label: value ? `${value} - ${label}` : "",
        });
    };

    if (!active) return null;

    const normStr = (v) => {
        if (v == null || v === '') return '';
        const num = Number(String(v).trim().replace(',', '.'));
        if (isNaN(num)) return '';
        return num < 1 ? num.toFixed(1) : Math.floor(num).toString();
    };
    const expValue = normStr(filters.experiencia);

    return (
        <div className="flex flex-col flex-1 p-4 overflow-auto" >
            <div className="flex flex-col gap-8 pt-4 w-full xl:flex-row">
                <div className="space-y-2 w-full">
                    <Select
                        id="cargo"
                        label="Cargo"
                        value={filters.cargo}
                        placeholder={"Selecione"}
                        options={renderOptions()}
                        onChange={handleGenericChange}
                    />
                </div>
                <div className="space-y-2 w-full">
                    <Select id="experiencia" label={"Experiência"} options={[
                        { label: "Selecione", value: ""},
                        { label: "6 meses", value: "0.6" },
                        { label: "1 ano", value: "1" },
                        { label: "2 anos", value: "2" },
                        { label: "3 anos", value: "3" },
                        { label: "4 anos", value: "4" },
                        { label: "5 anos", value: "5" },
                        { label: "6 anos", value: "6" },
                        { label: "7 anos", value: "7" },
                        { label: "8 anos", value: "8" },
                        { label: "9 anos", value: "9" },
                        { label: "10 anos", value: "10" }
                    ]}
                        value={expValue}
                        onChange={handleGenericChange}
                    />
                </div>
            </div>
            <div className="flex flex-col items-start w-full justify-center gap-5 pt-4 xl:flex-row">
                <div className='flex flex-row w-full justify-between lg:gap-5 md:gap-2'>
                    <div className="space-y-2 w-full lg:w-6/12">
                        <InputText
                            maxLength={9}
                            mask={"currency"}
                            placeholder={"0,00"}
                            id={"salarioDe"}
                            label={"Pretensão salarial De:"}
                            value={filters.salarioDe}
                            onChange={handleGenericChange}
                        />
                    </div>
                    <div className="space-y-2 w-full lg:w-6/12">
                        <InputText
                            maxLength={9}
                            mask={"currency"}
                            placeholder={"0,00"}
                            id={"salarioAte"}
                            label={"Até:"}
                            value={filters.salarioAte}
                            onChange={handleGenericChange}
                        />
                    </div>
                </div> 
                <div className='flex flex-row w-full justify-between lg:gap-5 md:gap-2'>
                    <div className="space-y-2 w-full lg:w-6/12">
                        <Select
                            id="educacaoDe"
                            label={'Escolaridade De'}
                            hideClearButton={true}
                            placeholder={"Selecione"}
                            options={escolaridades.map(escolaridade => ({
                                label: escolaridade.NM_GRAU_INSTRUCAO,
                                value: escolaridade.CD_GRAU_INSTRUCAO,
                                select: false
                            }))}
                            value={filters.educacaoDe}
                            onChange={handleGenericChange}
                        />
                    </div>
                    <div className="space-y-2 w-full lg:w-6/12 ">
                        <Select
                            id="educacaoAte"
                            label={'Até'}
                            hideClearButton={true}
                            placeholder={"Selecione"}
                            options={escolaridades.map(escolaridade => ({
                                label: escolaridade.NM_GRAU_INSTRUCAO,
                                value: escolaridade.CD_GRAU_INSTRUCAO,
                                select: false
                            }))}
                            value={filters.educacaoAte}
                            onChange={handleGenericChange}
                        />
                    </div>
                    <div className="flex w-6/12 items-center justify-center ml-4 translate-y-3 xl:w-1/12">
                        <Checkbox
                            id='cursando'
                            label="Cursando"
                            checked={filters.cursando}
                            onChange={handleGenericChange}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full lg:gap-5 md:gap-2 pt-4 lg:flex-row">
                <div className="space-y-2 w-full lg:w-1/3 ">
                    <InputTextArea
                        id='palavrasChaveObrigatorio'
                        label="Palavras-Chave Obrigatórias"
                        onChange={handleTextAreaChange}
                        value={filters.palavrasChaveObrigatorio}
                        hint='Separe as palavras por vírgula'
                    />
                </div>
                <div className="space-y-2 w-full lg:w-1/3 ">
                    <InputTextArea
                        id='palavrasChaveOpcional'
                        label="Palavras-Chave Opcionais"
                        onChange={handleTextAreaChange}
                        value={filters.palavrasChaveOpcional}
                        hint='Separe as palavras por vírgula'
                    />
                </div>
                <div className="space-y-2 w-full lg:w-1/3">
                    <InputTextArea
                        id='palavrasChaveExcluido'
                        label="Palavras-Chave a Excluir"
                        onChange={handleTextAreaChange}
                        value={filters.palavrasChaveExcluido}
                        hint='Separe as palavras por vírgula'
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 lg:gap-5 md:gap-2 pt-4 w-full">
                <div>
                    <InputDate
                        id="ultimaAtualizacaoDe"
                        label="Última Atualização De:"
                        value={filters.ultimaAtualizacaoDe || ""}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <InputDate
                        id="ultimaAtualizacaoAte"
                        label="Última Atualização Até:"
                        value={filters.ultimaAtualizacaoAte || ""}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <InputDate
                        id="dataCriacaoDe"
                        label="Data de criação De:"
                        value={filters.dataCriacaoDe || ""}
                        onChange={handleDateChange}
                        hint="Data mínima da criação do candidato no sistema."
                    />
                </div>
                <div>
                    <InputDate
                        id="dataCriacaoAte"
                        label="Data de criação Até:"
                        value={filters.dataCriacaoAte || ""}
                        onChange={handleDateChange}
                        hint="Data máxima da criação do candidato no sistema."
                    />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full md:items-center lg:gap-5 md:gap-2 pt-4 lg:flex-row">
                <div className="w-full text-sm font-medium text-gray-900 ">
                    <Select2Cliente
                        maxChars={50}
                        value={cliente}
                        onChange={setDadosCliente}
                        id="cdPessoaClienteRestricao"
                        label="Candidatos sem processo no cliente:"
                    />
                </div>
                <div className="w-full text-sm font-medium text-gray-900">
                    <InputDate
                        id="dtLimiteRestricao"
                        label="Data do último processo"
                        value={filters.dtLimiteRestricao || ""}
                        onChange={handleDateChange}
                        maxDate={dataHoje}
                        hint={"Filtra candidatos sem participação em processos seletivos desde a data escolhida."}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 pt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                        <Checkbox
                            id="agrupamento"
                            label="Pesquisa por agrupamento de cargo"
                            onChange={handleGenericChange}
                            checked={filters.agrupamento}
                        />
                    </div>
                    <div className="flex items-center">
                        <Checkbox
                            id="primeiroEmprego"
                            label="Primeiro emprego"
                            onChange={handleGenericChange}
                            checked={filters.primeiroEmprego}
                        />
                    </div>
                </div>

                <div className="flex flex-col flex-grow gap-4">
                    <span className="text-sm font-medium text-gray-900">Turnos Pretendidos</span>
                    <div className="flex flex-wrap gap-4">
                        <Checkbox
                            id="normal"
                            label="Normal"
                            onChange={handleTurnoChange}
                            checked={filters.turnos.includes("normal")}
                        />
                        <Checkbox
                            id="matutino"
                            label="Matutino"
                            onChange={handleTurnoChange}
                            checked={filters.turnos.includes("matutino")}
                        />
                        <Checkbox
                            id="vespertino"
                            label="Vespertino"
                            onChange={handleTurnoChange}
                            checked={filters.turnos.includes("vespertino")}
                        />
                        <Checkbox
                            id="noturno"
                            label="Noturno"
                            onChange={handleTurnoChange}
                            checked={filters.turnos?.includes("noturno")}
                        />
                        <Checkbox
                            id="revezamento"
                            label="Revezamento"
                            onChange={handleTurnoChange}
                            checked={filters.turnos?.includes("revezamento")}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full pt-4">
                <Select id="quantidadePesquisa" label={"Resultados por pesquisa"} options={[
                    { label: "50", value: 50 },
                    { label: "100", value: 100 },
                    { label: "200", value: 200 },
                    { label: "400", value: 400 },
                    { label: "600", value: 600 }
                ]}
                    value={filters.quantidadePesquisa}
                    onChange={handleGenericChange}
                />
            </div>
        </div >
    );
}

export default FiltroBasico;
