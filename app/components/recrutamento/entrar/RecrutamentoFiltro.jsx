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

const RecrutamentoFiltro = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const [filterData, setFilterData] = useState(false);

    const setDadosFiltroPesquisaCallback = useCallback((id, value) => {
        setFiltrosPesquisa((prevState) => ({ ...prevState, [id]: value }));
    }, [setFiltrosPesquisa]);
    const { user } = useAppContext();

    const handleChangeFilterData = (value) => {
        setFilterData((prevState) => ({ ...prevState, cd_pessoa_selecionador: value }));
        setFiltrosPesquisa((prevState) => ({ ...prevState, cd_pessoa_analista: value }));
    }

    return (
        <>
            <div className="flex flex-row flex-wrap gap-y-4 gap-x-2 mt-2 w-full">
                <div className="w-full">
                    <InputText
                        id="rec_nm_cargo"
                        label="Cargo"
                        value={filtrosPesquisa.nm_cargo}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("nm_cargo", value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="rec_nm_empresa"
                        label="Empresa"
                        value={filtrosPesquisa.nm_empresa}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("nm_empresa", value)}
                    />
                </div>
                <div className="w-full">
                    <DebouncedSearch.Root>
                        <DebouncedSearch.Label label={'Analista'} />
                        <DebouncedSearch.Select
                            ready={!empty(user.cd_sip) && !empty(filterData.cd_unidade)}
                            id="cd_pessoa_analista"
                            isClearable={true}
                            onChange={value => { handleChangeFilterData(value || "") }}
                            value={filterData.cd_pessoa_selecionador}
                            urlGet={`analista/lista-analistas/${user.cd_sip}/unidade/${filterData.cd_unidade}`}
                            optId={'CD_PESSOA'}
                            optLabel={'NM_USUARIO'}
                        />
                    </DebouncedSearch.Root>
                </div>
                <div className="w-full">
                    <InputText
                        id="rec_nr_vaga"
                        mask="numeric"
                        label="Código da vaga"
                        value={filtrosPesquisa.nr_vaga}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("nr_vaga", value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="rec_cc_vaga"
                        label="Centro de custo da vaga"
                        value={filtrosPesquisa.cc_vaga}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("cc_vaga", value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        mask="numeric"
                        id="rec_nr_requisicao"
                        label="Código da requisição"
                        value={filtrosPesquisa.nr_requisicao}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("nr_requisicao", value)}
                    />
                </div>
                <div className="w-full">
                    <SelectCidadeFilter
                        label="Cidade"
                        id="rec_cd_empresa"
                        placeholder="selecione"
                        value={filtrosPesquisa.cd_empresa}
                        onChange={(id, value) => {
                            setDadosFiltroPesquisaCallback("cd_empresa", value);
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Vagas</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"M"}
                    id={"rec_minhas_vagas"}
                    name={"radio_tipo_vagas"}
                    label={"Minhas Vagas"}
                    checked={filtrosPesquisa.tipo_vagas === "M"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("tipo_vagas", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"O"}
                    id={"rec_outras_vagas"}
                    name={"radio_tipo_vagas"}
                    label={"Vagas de Outros"}
                    checked={filtrosPesquisa.tipo_vagas === "O"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("tipo_vagas", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"A"}
                    id={"rec_ambas_vagas"}
                    name={"radio_tipo_vagas"}
                    label={"Ambas"}
                    checked={filtrosPesquisa.tipo_vagas === "A"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("tipo_vagas", value)}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Área</Subtitle>
            </div>

            <div className={"pt-1"}>
                <Checkbox
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("centro", value)}
                    id={"rec_centro"}
                    label={"Centro"}
                    checked={filtrosPesquisa.centro}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("norte", value)}
                    id={"rec_norte"}
                    label={"Norte"}
                    checked={filtrosPesquisa.norte}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("sul", value)}
                    id={"rec_sul"}
                    label={"Sul"}
                    checked={filtrosPesquisa.sul}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("leste", value)}
                    id={"rec_leste"}
                    label={"Leste"}
                    checked={filtrosPesquisa.leste}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("oeste", value)}
                    id={"rec_oeste"}
                    label={"Oeste"}
                    checked={filtrosPesquisa.oeste}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Setor</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"S"}
                    id={"rec_recrutamento"}
                    name={"radio_setor"}
                    label={"Recrutamento"}
                    checked={filtrosPesquisa.setor === "S"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("setor", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"N"}
                    id={"rec_selecao"}
                    label={"Seleção"}
                    name={"radio_setor"}
                    checked={filtrosPesquisa.setor === "N"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("setor", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"T"}
                    id={"rec_ambos"}
                    label={"Ambos"}
                    name={"radio_setor"}
                    checked={filtrosPesquisa.setor === "T"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("setor", value)}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>PCD</Subtitle>
            </div>
            <div className="flex flex-row flex-wrap gap-x-4">
                <div className="flex flex-col">
                    <Checkbox
                        id={"rec_somente_pcd"}
                        label={"Somente PCD"}
                        checked={filtrosPesquisa.somente_pcd}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback("somente_pcd", value)}
                    />
                </div>
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Abertura</Subtitle>
            </div>
            <Checkbox
                onChange={(id, value) => setDadosFiltroPesquisaCallback(last_24hr, value)}
                id={"rec_last_24hr"}
                label={"Vaga(s) últimas 24hrs"}
                checked={filtrosPesquisa.last_24hr}
            />

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

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Status</Subtitle>
            </div>
            <div className={cn("pt-1")}>
                <Checkbox
                    id={"rec_aberta"}
                    label={"Aberta"}
                    value={filtrosPesquisa.aberta}
                    checked={filtrosPesquisa.aberta}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("aberta", value)}
                />
            </div>
            <div className={cn("pt-1")}>
                <Checkbox
                    id={"rec_cliente"}
                    label={"Cliente"}
                    value={filtrosPesquisa.cliente}
                    checked={filtrosPesquisa.cliente}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("cliente", value)}
                />
            </div>
        </>
    );
};

export default RecrutamentoFiltro;
