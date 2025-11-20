import React, { useState, useEffect, useCallback } from "react";
import { Subtitle } from "@/components/Layouts/Typography";
import Radio from "@/components/inputs/Radio";

const FiltroRelatorioVagas = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const [filtros, setFiltros] = useState(filtrosPesquisa);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        setFiltrosPesquisa(filtros);
    }, [filtros]);

    const setFiltroRelatorioVagasCallback = useCallback((id, value) => {
        setFiltros(prevState => ({ ...prevState, [id]: value }));
    });

    return (
        ready && <form>
            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Status candidato</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={'T'}
                    id={"todos"}
                    name={"status_cand"}
                    label={'Todos'}
                    checked={filtros.status_cand == "T"}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback('status_cand', value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={'R'}
                    id={"reprovada"}
                    name={"status_cand"}
                    label={'Reprovada'}
                    checked={filtros.status_cand == "R"}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback('status_cand', value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={'P'}
                    name={"status_cand"}
                    id={"pendente"}
                    label={'Pendente'}
                    checked={filtros.status_cand == "P"}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback('status_cand', value)}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Tipo vaga</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={11}
                    name={"tipo_vaga"}
                    id={"comercial"}
                    label={"Comercial"}
                    checked={filtros.tipo_vaga == 11}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={12}
                    name={"tipo_vaga"}
                    id={"prospecção"}
                    label={"Prospecção"}
                    checked={filtros.tipo_vaga == 12}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={1}
                    id={"aberta"}
                    label={"Aberta"}
                    name={"tipo_vaga"}
                    checked={filtros.tipo_vaga == 1}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={7}
                    id={"cliente"}
                    label={"Cliente"}
                    name={"tipo_vaga"}
                    checked={filtros.tipo_vaga == 7}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={5}
                    name={"tipo_vaga"}
                    id={"cancelada"}
                    label={"Cancelada"}
                    checked={filtros.tipo_vaga == 5}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={6}
                    id={"fechada"}
                    label={"Fechada"}
                    name={"tipo_vaga"}
                    checked={filtros.tipo_vaga == 6}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={10}
                    name={"tipo_vaga"}
                    id={"bloqueado"}
                    label={"Bloqueado"}
                    checked={filtros.tipo_vaga == 10}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={9}
                    name={"tipo_vaga"}
                    checked={filtros.tipo_vaga == 9}
                    id={"cancelada_com_faturamento"}
                    label={"Cancelada_com_faturamento"}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={8}
                    name={"tipo_vaga"}
                    checked={filtros.tipo_vaga == 8}
                    id={"cancelada_com_selecao_sem_candidato"}
                    label={"Cancelada_com_selecao_sem_candidato"}
                    onChange={(id, value) => setFiltroRelatorioVagasCallback("tipo_vaga", value)}
                />
            </div>
        </form>
    );
}

export default FiltroRelatorioVagas;