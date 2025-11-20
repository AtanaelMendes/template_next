import SelectCidadeFilter from "@/components/inputs/SelectCidadeFilter";
import { Subtitle } from "@/components/Layouts/Typography";
import { useState, useEffect, useCallback } from "react";
import Checkbox from "@/components/inputs/Checkbox";
import Radio from "@/components/inputs/Radio";
import axiosInstance from "@/plugins/axios";

const FiltroVagasCandidato = ({ filtrosPesquisa, setFiltrosPesquisa, cdPessoaCandidato }) => {
    const [cargosCandidato, setCargosCandidato] = useState([]);
    const [filtros, setFiltros] = useState(filtrosPesquisa);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        getCargosCandidato();
    }, []);

    useEffect(() => {
        setFiltrosPesquisa(filtros);
    }, [filtros]);

    const setFiltroVagasCandidatoCallback = useCallback((id, value) => {
        setFiltros((prevState) => ({ ...prevState, [id]: value }));
    });

    const getCargosCandidato = () => {
        axiosInstance
            .get(`candidato/cargos/${cdPessoaCandidato}`)
            .then(function (response) {
                setCargosCandidato(response.data);
                let cdCargosString = response.data?.map((row, index) => {
                    return row.CD_CARGO;
                });
                setFiltroVagasCandidatoCallback("cd_cargo", cdCargosString.join());
                setReady(true);
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    const renderListaCargos = () => {
        if (cargosCandidato.length == 0) {
            return (
                <li key={0} className="text-sm">
                    Nenhum cargo selecionado
                </li>
            );
        }

        return cargosCandidato?.map((row, index) => {
            return (
                <li className="text-sm" key={`row-${index}`}>
                    {row.NM_CARGO}
                </li>
            );
        });
    };

    return (
        ready && (
            <form>
                <div className="flex flex-row flex-wrap gap-y-2 w-full">
                    <div className="w-full">
                        <SelectCidadeFilter
                            label="Cidade"
                            id="nm_cidade"
                            placeholder="selecione"
                            value={filtros.nm_cidade}
                            onChange={(id, value) => setFiltroVagasCandidatoCallback(id, value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                    <Subtitle>Região</Subtitle>
                </div>

                <div className={"pt-1"}>
                    <Checkbox
                        onChange={(id, value) => setFiltroVagasCandidatoCallback(id, value)}
                        id={"centro"}
                        label={"Centro"}
                    />
                </div>
                <div className={"pt-1"}>
                    <Checkbox
                        onChange={(id, value) => setFiltroVagasCandidatoCallback(id, value)}
                        id={"norte"}
                        label={"Norte"}
                    />
                </div>
                <div className={"pt-1"}>
                    <Checkbox
                        onChange={(id, value) => setFiltroVagasCandidatoCallback(id, value)}
                        id={"sul"}
                        label={"Sul"}
                    />
                </div>
                <div className={"pt-1"}>
                    <Checkbox
                        onChange={(id, value) => setFiltroVagasCandidatoCallback(id, value)}
                        id={"leste"}
                        label={"Leste"}
                    />
                </div>
                <div className={"pt-1"}>
                    <Checkbox
                        onChange={(id, value) => setFiltroVagasCandidatoCallback(id, value)}
                        id={"oeste"}
                        label={"Oeste"}
                    />
                </div>

                <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                    <Subtitle>Tipo vaga</Subtitle>
                </div>
                <div className={"pt-1"}>
                    <Radio
                        value={"S"}
                        id={"recrutamento"}
                        name={"radio_setor"}
                        label={"Recrutamento"}
                        checked={filtros.setor === "S"}
                        onChange={(id, value) => setFiltroVagasCandidatoCallback("setor", value)}
                    />
                </div>
                <div className={"pt-1"}>
                    <Radio
                        value={"N"}
                        id={"selecao"}
                        label={"Seleção"}
                        name={"radio_setor"}
                        checked={filtros.setor === "N"}
                        onChange={(id, value) => setFiltroVagasCandidatoCallback("setor", value)}
                    />
                </div>
                <div className={"pt-1"}>
                    <Radio
                        value={"T"}
                        id={"ambos"}
                        label={"Ambos"}
                        name={"radio_setor"}
                        checked={filtros.setor === "T"}
                        onChange={(id, value) => setFiltroVagasCandidatoCallback("setor", value)}
                    />
                </div>

                <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                    <Subtitle>Status vaga</Subtitle>
                </div>
                <div className={"pt-1"}>
                    <Radio
                        value={0}
                        id={"todas_vagas"}
                        name={"radio_status"}
                        label={"Todas as vagas"}
                        checked={filtros.status == 0}
                        onChange={(id, value) => setFiltroVagasCandidatoCallback("status", value)}
                    />
                </div>
                <div className={"pt-1"}>
                    <Radio
                        value={1}
                        id={"vagas_abertas"}
                        name={"radio_status"}
                        label={"Vagas abertas"}
                        checked={filtros.status == 1}
                        onChange={(id, value) => setFiltroVagasCandidatoCallback("status", value)}
                    />
                </div>
                <div className={"pt-1"}>
                    <Radio
                        value={7}
                        name={"radio_status"}
                        id={"vagas_monitoradas"}
                        label={"Vagas Monitoradas"}
                        checked={filtros.status == 7}
                        onChange={(id, value) => setFiltroVagasCandidatoCallback("status", value)}
                    />
                </div>

                <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                    <Subtitle>Cargos</Subtitle>
                </div>
                <ul>{renderListaCargos()}</ul>
            </form>
        )
    );
};

export default FiltroVagasCandidato;
