import CompetenciaRangeSlider from "../inputs/CompetenciaRangeSlider";
import SelectCompetencias from "../inputs/SelectCompetencias";
import { useCallback, useEffect, useState } from "react";
import { FieldLabel } from "../Layouts/Typography";
import ButtonToggle from "../buttons/ButtonToggle";
import Button from '@/components/buttons/Button';
import { empty } from "@/assets/utils";

const CardNovaCompetencia = ({ id, onChange, deleteCardFunction, options }) => {
    const [dadosNovaCompetencia, setDadosNovaCompetencia] = useState({
        id_mostra_curriculo: false,
        cd_competencia: 0,
        nr_nota: 1,
    });

    const setdadosNovaCompetenciaCallback = useCallback((id, value) => {
        setDadosNovaCompetencia(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(dadosNovaCompetencia);
        }
    }, [dadosNovaCompetencia]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                Nova competência
            </div>
            <div className={"py-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-2">
                    <div className={`col-span-4 flex items-center justify-center mb-2`}>
                        <div className="w-full px-2">
                            <SelectCompetencias
                                options={options}
                                id={`${id}_cd_competencia`}
                                label="Selecione uma competência:"
                                value={dadosNovaCompetencia.cd_competencia}
                                onChange={(id, value) => setdadosNovaCompetenciaCallback("cd_competencia", value)}
                            />
                        </div>
                    </div>
                    <div className={`col-span-4`}>
                        <CompetenciaRangeSlider
                            label={"Conhecimento:"}
                            id={`${id}_nr_nota`}
                            value={dadosNovaCompetencia.nr_nota}
                            onChange={(id, value) => setdadosNovaCompetenciaCallback("nr_nota", value)}
                        />
                    </div>
                    <div className={`col-span-4 flex items-center`}>
                        <div className="w-full grid justify-center ml-8">
                            <div>
                                <FieldLabel>Exibir no currículo?</FieldLabel>
                            </div>
                            <div>
                                <ButtonToggle
                                    primary
                                    labelOn={"Sim"}
                                    LabelOff={"Não"}
                                    id={`${id}_id_mostra_curriculo`}
                                    checked={dadosNovaCompetencia.id_mostra_curriculo}
                                    onChange={(id, value, checked) => setdadosNovaCompetenciaCallback("id_mostra_curriculo", checked)}
                                />
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <Button buttonType="danger" outline bordered size="small" className={"h-8 self-center mr-1 px-1 py-1"} onClick={() => { deleteCardFunction() }}>
                                Remover
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CardEditCompetencia = ({ dados, id, onChange, deleteCardFunction, options }) => {
    const [skipEffect, setSkipEffect] = useState(true);
    const [dadosCompetencia, setDadosCompetencia] = useState({
        id_mostra_curriculo: false,
        cd_competencia: 0,
        nr_nota: 1,
    });

    const setdadosCompetenciaCallback = useCallback((id, value) => {
        setSkipEffect(false);
        setDadosCompetencia(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(true);
            return;
        }

        if (typeof onChange === "function") {
            onChange(dadosCompetencia);
        }
    }, [dadosCompetencia]);

    useEffect(() => {
        //Ao carregar os valores do card salvo, não disparar a atualização do objeto do componente pai
        setSkipEffect(true);
        
        if (!empty(dados)) {
            setDadosCompetencia(dados);
        }
    }, [dados]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                {dadosCompetencia.card_title || "Competência"}
            </div>
            <div className={"py-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-2">
                    <div className={`col-span-4 flex items-center justify-center mb-2`}>
                        <div className="w-full px-2">
                            <SelectCompetencias
                                options={options}
                                id={`${id}_cd_competencia`}
                                label="Selecione uma competência:"
                                value={dadosCompetencia.cd_competencia}
                                onChange={(id, value) => setdadosCompetenciaCallback("cd_competencia", value)}
                            />
                        </div>
                    </div>
                    <div className={`col-span-4`}>
                        <CompetenciaRangeSlider
                            label={"Conhecimento:"}
                            id={`${id}_nr_nota`}
                            value={dadosCompetencia.nr_nota}
                            onChange={(id, value) => setdadosCompetenciaCallback("nr_nota", value)}
                        />
                    </div>
                    <div className={`col-span-4 flex items-center`}>
                        <div className="w-full grid justify-center ml-8">
                            <div>
                                <FieldLabel>Exibir no currículo?</FieldLabel>
                            </div>
                            <div>
                                <ButtonToggle
                                    primary
                                    labelOn={"Sim"}
                                    LabelOff={"Não"}
                                    id={`${id}_id_mostra_curriculo`}
                                    checked={dadosCompetencia.id_mostra_curriculo}
                                    onChange={(id, value, checked) => setdadosCompetenciaCallback("id_mostra_curriculo", checked)}
                                />
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <Button buttonType="danger" outline bordered size="small" className={"h-8 self-center mr-1 px-1 py-1"} onClick={() => { deleteCardFunction() }}>
                                Remover
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CardNovaCompetencia, CardEditCompetencia };