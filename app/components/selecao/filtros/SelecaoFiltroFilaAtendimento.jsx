import { Caption, Title, Subtitle, Label } from "@/components/Layouts/Typography"
import React, { useState, useEffect, useCallback } from "react";
import { Datepicker } from "flowbite-react";
import InputText from "@/components/inputs/InputText";
import Select from "@/components/inputs/Select";
import moment from "moment";
import InputDate from "@/components/inputs/InputDate";

const SelecaoFiltroFilaAtendimento = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const [ready, setReady] = useState(false);
    const [dadosFiltroPesquisa, setDadosFiltroPesquisa] = useState(filtrosPesquisa);

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        setFiltrosPesquisa(dadosFiltroPesquisa);
    }, [dadosFiltroPesquisa]);

    const setDadosFiltroPesquisaCallback = useCallback((id, value) => {
        setDadosFiltroPesquisa(prevState => ({ ...prevState, [id]: value }));
    });

    return (
        ready && <form>
            <div className="flex flex-row flex-wrap gap-y-4 gap-x-2 mt-2w-full">
                <div className="flex flex-col w-full my-2 font-semibold">
                    <InputDate
                        id="filtro_data_atendimento"
                        label="Data de atendimento"
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                        value={dadosFiltroPesquisa.filtro_data_atendimento}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="filtro_nome_candidato"
                        label="Nome do candidato"
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                        value={dadosFiltroPesquisa.filtro_nome_candidato}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="filtro_nome_cliente"
                        label="Nome do cliente"
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                        value={dadosFiltroPesquisa.filtro_nome_cliente}
                    />
                </div>
                <Select
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    placeholder="Todos"
                    hideClearButton={true}
                    label="Tipo de agendamento"
                    id="filtro_tipo_agendamento"
                    options={[
                        { label: "Entrevista", value: 'E', selected: (dadosFiltroPesquisa.filtro_tipo_agendamento == 'E') },
                        { label: "Teste", value: 'T', selected: (dadosFiltroPesquisa.filtro_tipo_agendamento == 'T') },
                        { label: "Call Center", value: 'C', selected: (dadosFiltroPesquisa.filtro_tipo_agendamento == 'C') }
                    ]}
                />
            </div>
        </form>
    );
}

export default SelecaoFiltroFilaAtendimento;