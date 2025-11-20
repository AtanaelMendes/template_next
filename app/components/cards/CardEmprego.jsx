import { useCallback, useEffect, useState } from "react";
import { FieldLabel } from "../Layouts/Typography";
import { empty, isBelowXl } from "@/assets/utils";
import Button from '@/components/buttons/Button';
import PillsBadge from "../buttons/PillsBadge";
import InputText from '../inputs/InputText';
import InputDate from '../inputs/InputDate';
import RichText from "../inputs/RichText";
import InputTextArea from "../inputs/InputTextArea";

// As variaveis dataInicio e dataFim devem estar no formato momentjs
const getDateDiffString = (dataInicio, dataFim) => {
    if (!dataInicio.isValid() || !dataFim.isValid()) {
        return "Período inválido";
    }

    if (dataInicio.isSame(dataFim, 'day')) {
        return "Menos de um dia";
    }

    const years = dataFim.diff(dataInicio, 'years');
    dataInicio.add(years, 'years');

    const months = dataFim.diff(dataInicio, 'months');
    dataInicio.add(months, 'months');

    const days = dataFim.diff(dataInicio, 'days');
    dataInicio.add(days, 'days');

    const yearText = years === 0 ? "" : (years > 1 ? `${years} anos` : "1 ano");
    const monthText = months === 0 ? "" : (months > 1 ? `${months} meses` : "1 mês");
    const dayText = days === 0 ? "" : (days > 1 ? `${days} dias` : "1 dia");

    let separator1 = "";
    let separator2 = "";

    //Se tiver ano E mes OU dia
    if (years > 0 && (months > 0 || days > 0)) {
        //Se tiver mes e dia usa virgula (1 ano, 1 mês e 1 dia)
        //Se não tiver mes ou dia, usa 'e' (1 ano e 2 meses)
        separator1 = (months > 0 && days > 0) ? ", " : " e ";
    }

    //Se tiver ano, mes e dia usa OU se tiver apenas mês e dia usa 'e', senao usa o 'e' do separador 1
    separator2 = ((years > 0 && months > 0 && days > 0) || (years == 0 && months > 0 && days > 0)) ? " e " : "";

    let periodo = `${yearText}${separator1}${monthText}${separator2}${dayText}`;
    return periodo.trim() || "Menos de um dia";
};

const CardNovoEmprego = ({ id, onChange, deleteCardFunction }) => {
    const [tempoEmpresa, setTempoEmpresa] = useState("Período inválido");
    const [invalidDateMessage, setInvalidDateMessage] = useState("");
    const [isValidPeriod, setIsValidPeriod] = useState(true);
    const [dadosNovoEmprego, setDadosNovoEmprego] = useState({
        ds_experiencia_profissional: "",
        vl_ultimo_salario: "",
        nm_pessoa_empresa: "",
        ds_motivo_saida: "",
        dt_inicio: "",
        nm_cargo: "",
        dt_fim: "",
    });

    const setDadosNovoEmpregoCallback = useCallback((id, value) => {
        setDadosNovoEmprego(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(dadosNovoEmprego);
        }
    }, [dadosNovoEmprego]);

    const validaDatas = (dtInicio, dtFim) => {
        setIsValidPeriod(true);
        setInvalidDateMessage("");
        setTempoEmpresa("Informe o período");

        if (empty(dtInicio)) {
            return;
        }

        let dataInicio = moment(dtInicio, 'YYYY-MM-DD');
        let dataFim = moment();

        if (!empty(dtFim)) {
            dataFim = moment(dtFim, 'YYYY-MM-DD');
        }

        if (!dataInicio.isValid() || !dataFim.isValid()) {
            setInvalidDateMessage("");
            setTempoEmpresa("Período inválido");
        }

        if (dataInicio.isAfter(dataFim)) {
            setInvalidDateMessage("A data de admissão deve ser menor ou igual a data de demissão");
            setTempoEmpresa("Período inválido");
            setIsValidPeriod(false);
            return;
        }

        let datediff = getDateDiffString(dataInicio, dataFim);
        setTempoEmpresa(datediff);
    };

    useEffect(() => {
        validaDatas(dadosNovoEmprego.dt_inicio, dadosNovoEmprego.dt_fim);
    }, [dadosNovoEmprego.dt_inicio, dadosNovoEmprego.dt_fim]);

    const [validaReq, setValidaReq] = useState({
        nm_pessoa_empresa: {
            error: false,
            errorMsg: "Necessário informar o nome da empresa!",
        },
        nm_cargo: {
            error: false,
            errorMsg: "Necessário informar o cargo!",
        },
        dt_inicio: {
            error: false,
            errorMsg: "Necessário informar a data de início!",
        },
    });

    return (
        <div className="mb-3 shadow-md shadow-green-500 rounded-lg">
            <div className={`bg-green-500 text-white font-semibold px-4 rounded-t-lg text-sm py-1`}>
                Novo Emprego
            </div>
            <div className={"p-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5 mt-2">
                    <div className={"col-span-12"}>
                        <InputText
                            required={validaReq}
                            label={"Nome da empresa:"}
                            id={`${id}_nm_pessoa_empresa`}
                            value={dadosNovoEmprego.nm_pessoa_empresa}
                            onChange={(id, value) => setDadosNovoEmpregoCallback("nm_pessoa_empresa", value)}
                        />
                    </div>

                    <div className={"col-span-10 md:col-span-9 sm:col-span-8"}>
                        <InputText
                            required={validaReq}
                            id={`${id}_nm_cargo`}
                            label={"Último cargo na empresa:"}
                            value={dadosNovoEmprego.nm_cargo}
                            onChange={(id, value) => setDadosNovoEmpregoCallback("nm_cargo", value)}
                        />
                    </div>

                    <div className={"col-span-2 md:col-span-3 sm:col-span-4"}>
                        <InputText
                            maxLength={9}
                            mask={"currency"}
                            placeholder={"0,00"}
                            label={"Último salário:"}
                            id={`${id}_vl_ultimo_salario`}
                            value={dadosNovoEmprego.vl_ultimo_salario}
                            onChange={(id, value) => setDadosNovoEmpregoCallback("vl_ultimo_salario", value)}
                        />
                    </div>

                    <div className={"col-span-4"}>
                        <InputDate
                            required={validaReq}
                            id={`${id}_dt_inicio`}
                            label={"Data de Admissão:"}
                            value={dadosNovoEmprego.dt_inicio}
                            onChange={(id, value) => setDadosNovoEmpregoCallback("dt_inicio", value)}
                        />
                    </div>

                    <div className={"col-span-4"}>
                        <InputDate
                            id={`${id}_dt_fim`}
                            label={"Data de Demissão:"}
                            value={dadosNovoEmprego.dt_fim}
                            onChange={(id, value) => setDadosNovoEmpregoCallback("dt_fim", value)}
                        />
                    </div>

                    <div className={"col-span-4"}>
                        <FieldLabel className={`${isBelowXl() ? 'mb-0.5 text-xs' : ''}`}>
                            Tempo de Empresa:
                        </FieldLabel>
                        <div className={"flex mt-1.5"}>
                            <PillsBadge type="primary" small>{tempoEmpresa}</PillsBadge>
                        </div>
                    </div>

                    <div className={"col-span-12 content-end"}>
                        <InputText
                            label={"Motivo da saída:"}
                            id={`${id}_ds_motivo_saida`}
                            value={dadosNovoEmprego.ds_motivo_saida}
                            onChange={(id, value) => setDadosNovoEmpregoCallback("ds_motivo_saida", value)}
                        />
                    </div>

                    {!isValidPeriod && <div className="col-span-12 text-xs text-red-600 font-semibold">
                        {invalidDateMessage}
                    </div>}

                    <div className={"col-span-12 mb-4"}>
                        <RichText
                            maxLength={4000}
                            id={`${id}_ds_experiencia_profissional`}
                            label={"Atribuições e realizações na empresa:"}
                            value={dadosNovoEmprego.ds_experiencia_profissional}
                            onChange={(id, checked) => setDadosNovoEmpregoCallback("ds_experiencia_profissional", checked)}
                        />
                    </div>
                    <div className={"flex col-span-12 justify-center"}>
                        <Button buttonType="danger" size="small" onClick={() => { deleteCardFunction() }}>
                            Remover experiência
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CardEditEmprego = ({ id, dados, onChange, deleteCardFunction }) => {
    const [tempoEmpresa, setTempoEmpresa] = useState("Período inválido");
    const [invalidDateMessage, setInvalidDateMessage] = useState("");
    const [isValidPeriod, setIsValidPeriod] = useState(true);
    const [skipEffect, setSkipEffect] = useState(true);
    const [dadosEmprego, setDadosEmprego] = useState({
        ds_experiencia_profissional: "",
        vl_ultimo_salario: "",
        nm_pessoa_empresa: "",
        ds_motivo_saida: "",
        nr_sequencia: "",
        card_title: "",
        dt_inicio: "",
        nm_cargo: "",
        dt_fim: "",
        id: "",
    });

    const setDadosEmpregoCallback = useCallback((id, value) => {
        setSkipEffect(false);
        setDadosEmprego(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(true);
            return;
        }

        if (typeof onChange === "function") {
            onChange(dadosEmprego);
        }
    }, [dadosEmprego]);

    useEffect(() => {
        //Ao carregar os valores do card salvo, não disparar a atualização do objeto do componente pai
        setSkipEffect(true);

        if (!empty(dados)) {
            setDadosEmprego(dados);
        }
    }, [dados]);

    const validaDatas = (dtInicio, dtFim) => {
        setIsValidPeriod(true);
        setInvalidDateMessage("");
        setTempoEmpresa("Informe o período");

        if (empty(dtInicio) || empty(dtFim)) {
            return;
        }

        let dataInicio = moment(dtInicio, 'YYYY-MM-DD');
        let dataFim = moment();

        if (!empty(dtFim)) {
            dataFim = moment(dtFim, 'YYYY-MM-DD');
        }

        if (!dataInicio.isValid() || !dataFim.isValid()) {
            setInvalidDateMessage("");
            setTempoEmpresa("Período inválido");
        }

        if (dataInicio.isAfter(dataFim)) {
            setInvalidDateMessage("A data de admissão deve ser menor ou igual a data de demissão");
            setTempoEmpresa("Período inválido");
            setIsValidPeriod(false);
            return;
        }

        let datediff = getDateDiffString(dataInicio, dataFim);
        setTempoEmpresa(datediff);
    };

    useEffect(() => {
        validaDatas(dadosEmprego.dt_inicio, dadosEmprego.dt_fim);
    }, [dadosEmprego.dt_inicio, dadosEmprego.dt_fim]);

    const [validaReq, setValidaReq] = useState({
        nm_pessoa_empresa: {
            error: false,
            errorMsg: "Necessário informar o nome da empresa!",
        },
        nm_cargo: {
            error: false,
            errorMsg: "Necessário informar o cargo!",
        },
        dt_inicio: {
            error: false,
            errorMsg: "Necessário informar a data de início!",
        },
    });

    return (
        <div className="mb-3 shadow-md hover:shadow-primary rounded-lg">
            <div className={`bg-blue-600 text-white font-semibold px-4 rounded-t-lg text-sm py-1`}>
                {dadosEmprego.card_title}
            </div>
            <div className={"p-1 xl:p-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5 mt-2">
                    <div className={"col-span-12"}>
                        <InputText
                            required={validaReq}
                            id={`${id}_nm_pessoa_empresa`}
                            label={"Nome da empresa:"}
                            value={dadosEmprego.nm_pessoa_empresa}
                            onChange={(id, value) => setDadosEmpregoCallback("nm_pessoa_empresa", value)}
                        />
                    </div>

                    <div className={"col-span-10 md:col-span-9 sm:col-span-8"}>
                        <InputText
                            required={validaReq}
                            id={`${id}_nm_cargo`}
                            label={"Último cargo na empresa:"}
                            value={dadosEmprego.nm_cargo}
                            onChange={(id, value) => setDadosEmpregoCallback("nm_cargo", value)}
                        />
                    </div>

                    <div className={"col-span-2 md:col-span-3 sm:col-span-4"}>
                        <InputText
                            maxLength={9}
                            mask={"currency"}
                            placeholder={"0,00"}
                            label={"Último salário:"}
                            id={`${id}_vl_ultimo_salario`}
                            value={dadosEmprego.vl_ultimo_salario}
                            onChange={(id, value) => setDadosEmpregoCallback("vl_ultimo_salario", value)}
                        />
                    </div>

                    <div className={"col-span-3"}>
                        <InputDate
                            required={validaReq}
                            id={`${id}_dt_inicio`}
                            label={"Data de Admissão:"}
                            value={dadosEmprego.dt_inicio}
                            onChange={(id, value) => setDadosEmpregoCallback("dt_inicio", value)}
                        />
                    </div>

                    <div className={"col-span-3 content-end"}>
                        <InputDate
                            id={`${id}_dt_fim`}
                            label={"Data de Demissão:"}
                            value={dadosEmprego.dt_fim}
                            onChange={(id, value) => setDadosEmpregoCallback("dt_fim", value)}
                        />
                    </div>

                    <div className={"col-span-3 content-center"}>
                        <FieldLabel className={`${isBelowXl() ? 'mb-0.5 text-xs' : ''}`}>
                            Tempo de Empresa:
                        </FieldLabel>
                        <div className={"flex mt-1.5"}>
                            <PillsBadge type="primary" small>{tempoEmpresa}</PillsBadge>
                        </div>
                    </div>

                    <div className={"col-span-12 content-end"}>
                        <InputText
                            label={"Motivo da saída:"}
                            id={`${id}_ds_motivo_saida`}
                            value={dadosEmprego.ds_motivo_saida}
                            onChange={(id, value) => setDadosEmpregoCallback("ds_motivo_saida", value)}
                        />
                    </div>

                    {!isValidPeriod && <div className="col-span-12 text-xs text-red-600 font-semibold">
                        {invalidDateMessage}
                    </div>}

                    <div className={"col-span-12 mb-4"}>
                        <RichText
                            maxLength={4000}
                            id={`${id}_ds_experiencia_profissional`}
                            label={"Atribuições e realizações na empresa:"}
                            value={dadosEmprego.ds_experiencia_profissional}
                            onChange={(id, value) => setDadosEmpregoCallback("ds_experiencia_profissional", value)}
                        />
                    </div>
                    <div className={"flex col-span-12 justify-center"}>
                        <Button buttonType="danger" size="small" onClick={() => { deleteCardFunction() }}>
                            Remover experiência
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CardNovoEmprego, CardEditEmprego };