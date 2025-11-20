import SelectCidadeFilter from "@/components/inputs/SelectCidadeFilter";
import { DebouncedSearch } from '@/components/inputs/DebouncedSearch';
import { Subtitle } from "@/components/Layouts/Typography";
import InputText from "@/components/inputs/InputText";
import InputDate from "@/components/inputs/InputDate";
import { useAppContext } from "@/context/AppContext";
import Checkbox from "@/components/inputs/Checkbox";
import { useCallback, useState } from "react";
import Radio from "@/components/inputs/Radio";
import { cn, empty } from "@/assets/utils";

const RecrutamentoFiltroCandidato = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const [filterData, setFilterData] = useState(false);

    const setDadosFiltroPesquisaCallback = useCallback((id, value) => {
        setFiltrosPesquisa((prevState) => ({ ...prevState, [id]: value }));
    }, [setFiltrosPesquisa]);
    const { user } = useAppContext();

    const handleChangeFilterData = (value) => {
        setFilterData((prevState) => ({ ...prevState, analistas: value }));
        setFiltrosPesquisa((prevState) => ({ ...prevState, analistas: value }));
    }

    return (
        <>
            <div className="flex flex-row flex-wrap gap-y-2 w-full">
                <div className="w-full">
                    <DebouncedSearch.Root>
                        <DebouncedSearch.Label label={'Analista'} />
                        <DebouncedSearch.Select
                            ready={!empty(user.cd_unid)}
                            id="cd_pessoa_analista"
                            isClearable={true}
                            isMultiple={true}
                            onChange={value => { handleChangeFilterData(value || "") }}
                            value={filtrosPesquisa.analistas}
                            urlGet={`analista/analistas-unidade/${user.cd_unid}`}
                            optId={'usuario'}
                            optLabel={'nome'}
                        />
                    </DebouncedSearch.Root>
                </div>

                <div className="flex flex-col w-full my-2 font-semibold">
                    <InputDate
                        id="rec_inicio"
                        label="Início"
                        value={filtrosPesquisa.inicio}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("inicio", value)}
                    />
                </div>

                <div className="flex flex-col w-full font-semibold">
                    <InputDate
                        id="rec_termino"
                        label="Término"
                        value={filtrosPesquisa.termino}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("termino", value)}
                    />
                </div>

                <div className="flex flex-col w-full font-semibold">
                    <label className="mt-2 text-sm font-medium text-gray-900 select-none">Tipo de registro</label>
                    <div className="flex gap-4 mt-1">
                        <Radio
                            id="tipo_registro_alterados"
                            name="tipo_registro"
                            value="A"
                            label="Alterados"
                            checked={filtrosPesquisa.tipo_registro === "A"}
                            onChange={() => setDadosFiltroPesquisaCallback("tipo_registro", "A")}
                        />
                        <Radio
                            id="tipo_registro_criados"
                            name="tipo_registro"
                            value="I"
                            label="Criados"
                            checked={filtrosPesquisa.tipo_registro === "I"}
                            onChange={() => setDadosFiltroPesquisaCallback("tipo_registro", "I")}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecrutamentoFiltroCandidato;
