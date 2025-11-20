import SelectAnalistaFilter from "@/components/inputs/SelectAnalistaFilter";
import SelectCidadeFilter from "@/components/inputs/SelectCidadeFilter";
import React, { useState, useEffect, useCallback } from "react";
import SelectUnidade from "@/components/inputs/SelectUnidade";
import { Subtitle } from "@/components/Layouts/Typography";
import InputText from "@/components/inputs/InputText";
import InputDate from "@/components/inputs/InputDate";
import Checkbox from "@/components/inputs/Checkbox";
import Radio from "@/components/inputs/Radio";

const SelecaoFiltroGerencial = ({ filtrosPesquisa, setFiltrosPesquisa }) => {
    const [limparAnalistas, setLimparAnalistas] = useState(false);
    const [ready, setReady] = useState(false);
    const [filtros, setFiltros] = useState(filtrosPesquisa);

    const handleChangeUnidade = (id, value) => {
        setDadosFiltroPesquisaCallback(id, value);
        setDadosFiltroPesquisaCallback("cd_pessoa_analista", "");
        setLimparAnalistas(true);
    };

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        setFiltrosPesquisa?.(filtros);
    }, [filtros]);

    const setDadosFiltroPesquisaCallback = useCallback((id, value) => {
        setFiltros(prevState => ({ ...prevState, [id]: value }));
    }, []);

    return (
        ready && <form>
            <div className="flex flex-row flex-wrap  w-full gap-y-4 gap-x-2 mt-2">
                <div className="w-full">
                    <SelectUnidade
                        label="Unidade"
                        id="cd_unidade"
                        placeholder="selecione"
                        value={filtros.cd_unidade}
                        init={ready}
                        onChange={(id, value) => handleChangeUnidade(id, value)}
                    />
                </div>
                <div className="w-full">
                    <SelectAnalistaFilter
                        label="Analista"
                        placeholder="selecione"
                        id="cd_pessoa_analista"
                        limparOpcoes={limparAnalistas}
                        cdEmpresa={filtros.cd_unidade}
                        setLimparOpcoes={setLimparAnalistas}
                        value={filtros.cd_pessoa_analista}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
                {/* <div className="w-full">
                    <SelectCidadeFilter
                        label="Cidade"
                        id="cd_cidade"
                        placeholder="selecione"
                        value={filtros.cd_cidade}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div> */}
                <div className="w-full">
                    <InputText
                        id="nm_cargo"
                        label="Cargo"
                        value={filtros.nm_cargo}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="nm_empresa"
                        label="Empresa"
                        value={filtros.nm_empresa}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="nr_vaga"
                        mask="numeric"
                        label="Código da vaga"
                        value={filtros.nr_vaga}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        id="cc_vaga"
                        label="Centro de custo da vaga"
                        value={filtros.cc_vaga}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
                <div className="w-full">
                    <InputText
                        mask="numeric"
                        id="nr_requisicao"
                        label="Código da requisição"
                        value={filtros.nr_requisicao}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
            </div>

            {/* <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Vagas</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"M"}
                    id={"minhas_vagas"}
                    name={"radio_tipo_vagas"}
                    label={"Minhas Vagas"}
                    checked={filtros.tipo_vagas === "M"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("tipo_vagas", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"O"}
                    id={"outras_vagas"}
                    name={"radio_tipo_vagas"}
                    label={"Vagas de Outros"}
                    checked={filtros.tipo_vagas === "O"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("tipo_vagas", value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={"A"}
                    id={"ambas_vagas"}
                    name={"radio_tipo_vagas"}
                    label={"Ambas"}
                    checked={filtros.tipo_vagas === "A"}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback("tipo_vagas", value)}
                />
            </div> */}

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Área</Subtitle>
            </div>

            <div className={"pt-1"}>
                <Checkbox onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)} id={"centro"} label={"Centro"} />
            </div>
            <div className={"pt-1"}>
                <Checkbox onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)} id={"norte"} label={"Norte"} />
            </div>
            <div className={"pt-1"}>
                <Checkbox onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)} id={"sul"} label={"Sul"} />
            </div>
            <div className={"pt-1"}>
                <Checkbox onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)} id={"leste"} label={"Leste"} />
            </div>
            <div className={"pt-1"}>
                <Checkbox onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)} id={"oeste"} label={"Oeste"} />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Setor</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={'S'}
                    id={"recrutamento"}
                    name={"radio_setor"}
                    label={'Recrutamento'}
                    checked={filtros.setor === 'S'}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback('setor', value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={'N'}
                    id={"selecao"}
                    label={'Seleção'}
                    name={"radio_setor"}
                    checked={filtros.setor === 'N'}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback('setor', value)}
                />
            </div>
            <div className={"pt-1"}>
                <Radio
                    value={'T'}
                    id={"ambos"}
                    label={'Ambos'}
                    name={"radio_setor"}
                    checked={filtros.setor === 'T'}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback('setor', value)}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>PCD</Subtitle>
            </div>
            <div className="flex flex-row flex-wrap gap-x-4">
                <div className="flex flex-col">
                    <Checkbox
                        id={"somente_pcd"}
                        label={'Somente PCD'}
                        checked={filtros.somente_pcd}
                        onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                    />
                </div>
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Abertura</Subtitle>
            </div>
            <Checkbox onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)} id={"last_24hr"} label={"Vaga(s) últimas 24hrs"} />
            
            <div className="flex flex-col w-full my-2 font-semibold">
                <InputDate
                    id="inicio"
                    label="Início"
                    value={filtros.inicio}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>

            <div className="flex flex-col w-full font-semibold">
                <InputDate
                    id="termino"
                    label="Término"
                    value={filtros.termino}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>

            <div className="flex flex-col w-full border-b-2 my-2 font-semibold">
                <Subtitle>Status</Subtitle>
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"comercial"}
                    label={"Comercial"}
                    value={filtros.comercial}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"prospeccao"}
                    label={"Prospecção"}
                    value={filtros.prospeccao}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"aberta"}
                    label={"Aberta"}
                    value={filtros.aberta}
                    checked={filtros.aberta}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"cliente"}
                    label={"Cliente"}
                    value={filtros.cliente}
                    checked={filtros.cliente}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"cancelada"}
                    label={"Cancelada"}
                    value={filtros.cancelada}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"fechada"}
                    label={"Fechada"}
                    value={filtros.fechada}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"bloqueado"}
                    label={"Bloqueado"}
                    value={filtros.bloqueado}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"canc_com_faturamento"}
                    label={"Cancelada com faturamento"}
                    value={filtros.canc_com_faturamento}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"canc_selecao_sem_candidato"}
                    label={"Cancelada com selecao sem candidato"}
                    value={filtros.canc_selecao_sem_candidato}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
            <div className={"pt-1"}>
                <Checkbox
                    id={"congelada"}
                    label={"Congelada"}
                    value={filtros.congelada}
                    onChange={(id, value) => setDadosFiltroPesquisaCallback(id, value)}
                />
            </div>
        </form>
    );
}

export default SelecaoFiltroGerencial;