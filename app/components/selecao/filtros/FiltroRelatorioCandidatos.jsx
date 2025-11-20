import React, { useState, useEffect, useCallback } from "react";
import { Subtitle } from "@/components/Layouts/Typography";
import InputDate from "@/components/inputs/InputDate";
import Radio from "@/components/inputs/Radio";

const FiltroRelatorioCandidatos = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const [filtros, setFiltros] = useState(filtrosPesquisa);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        setFiltrosPesquisa(filtros);
    }, [filtros]);

    const setFiltroRelatorioCandidatosCallback = useCallback((id, value) => {
        setFiltros(prevState => ({ ...prevState, [id]: value }));
    });

    return (
        ready && <form>
            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Período</Subtitle>
            </div>
            <div className={"pt-1"}>
                <InputDate
                    label={"De"}
                    id={"dt_inicio"}
                    value={filtros.dt_inicio}
                    onChange={(id, value) => setFiltroRelatorioCandidatosCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <InputDate
                    label={"Até"}
                    id={"dt_fim"}
                    value={filtros.dt_fim}
                    onChange={(id, value) => setFiltroRelatorioCandidatosCallback(id, value)}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Tipo</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"I"}
                    name={"tipo_cand"}
                    id={"cand_criados"}
                    label={"Candidatos criados"}
                    checked={filtros.tipo_cand == "I"}
                    onChange={(id, value) => setFiltroRelatorioCandidatosCallback("tipo_cand", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"A"}
                    name={"tipo_cand"}
                    id={"cand_alterados"}
                    label={"Candidatos alterados"}
                    checked={filtros.tipo_cand == "A"}
                    onChange={(id, value) => setFiltroRelatorioCandidatosCallback("tipo_cand", value)}
                />
            </div>
        </form>
    );
}

export default FiltroRelatorioCandidatos;