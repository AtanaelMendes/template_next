import CandidatosRelacionados from "@/components/selecao/entrar/CandidatosRelacionados";
import CandidatosDescartados from "@/components/selecao/entrar/CandidatosDescartados";
import CandidatosWeb from "@/components/selecao/entrar/CandidatosWeb";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageTabs from "@/components/Layouts/PageTabs";
import { useAppContext } from "@/context/AppContext";
import PesquisasVaga from "./PesquisasVaga";

const CandidatosVaga = ({
    nrVagaCliente,
    init,
    activeTab,
    setVagaDetalheOnView,
    tabName,
    setToggleView,
    toggleView,
    atualizaDetalhesVaga,
}) => {
    const [pageTabs, setPageTabs] = useState([]);
    const {
        getCandidatosRelacionados,
        getCandidatosDescartados,
        getCandidatosWeb,
        getHistoricoPesquisas,
        nrVagaClienteCtx,
        setNrVagaClienteCtx,
        candidatosRelacionadosList,
        candidatosWebList,
        candidatosDescartadosList,
        pesquisasVaga,
        situacaoVaga,
        getSituacaoVaga,
    } = useAppContext();

    useEffect(() => {
        setPageTabs([
            {
                name: "Candidatos Relacionados",
                id: "candidatos_relacionados",
                active: activeTab === "candidatos_relacionados",
                contador: 0,
                visible: true,
                reloadTab: () => { reloadCandidatosRelacionados(); }
            },
            {
                name: "Candidatos Web",
                id: "candiatos_web",
                active: activeTab === "candiatos_web",
                contador: 0,
                visible: true,
                reloadTab: () => { reloadCandidatosWeb(); }
            },
            {
                name: "Candidatos Descartados",
                id: "candidatos_descartados",
                active: activeTab === "candidatos_descartados",
                contador: 0,
                visible: true,
                reloadTab: () => { reloadCandidatosDescartados(); }
            },
            {
                name: "Histórico de Pesquisas",
                id: "historico_pesquisas",
                active: activeTab === "historico_pesquisas",
                contador: 0,
                visible: true,
                reloadTab: () => { reloadHistoricoPesquisas(); }
            }
        ]);
    }, [nrVagaClienteCtx]);

    const reloadCandidatosRelacionados = useCallback(() => {
        getCandidatosRelacionados();
    }, [nrVagaClienteCtx]);

    const reloadCandidatosWeb = useCallback(() => {
        getCandidatosWeb();
    }, [nrVagaClienteCtx]);

    const reloadCandidatosDescartados = useCallback(() => {
        getCandidatosDescartados();
    }, [nrVagaClienteCtx]);

    const reloadHistoricoPesquisas = useCallback(() => {
        getHistoricoPesquisas();
    }, [nrVagaClienteCtx]);

    const onSetVagaDetalheOnView = (nrVaga) => {
        setVagaDetalheOnView(nrVaga);
    };

    const changeTab = (nmTab) => {
        setPageTabs((prevTabs) =>
            prevTabs.map((tab) => {
                const isActive = tab.id === nmTab;
                // Só retorna um novo objeto se o valor mudar
                if (tab.active !== isActive) {
                    return { ...tab, active: isActive };
                }
                return tab;
            })
        );
    };

    const setContadorTab = (id, value) => {
        setPageTabs((prevTabs) =>
            prevTabs.map((tab) => {
                if (tab.id === id && tab.contador !== value) {
                    return { ...tab, contador: value };
                }
                return tab;
            })
        );
    };

    const refreshList = () => {
        getCandidatosRelacionados();
        getCandidatosWeb();
        getCandidatosDescartados();
        getHistoricoPesquisas();
    };

    useEffect(() => {
        setNrVagaClienteCtx(nrVagaCliente);
    }, [nrVagaCliente]);

    useEffect(() => {
        if (nrVagaClienteCtx && init) {
            getSituacaoVaga();
            getCandidatosRelacionados();
            getCandidatosWeb();
            getCandidatosDescartados();
            getHistoricoPesquisas();
        }
    }, [nrVagaClienteCtx, init]);

    useEffect(() => {
        setContadorTab("candiatos_web", candidatosWebList.length);
    }, [candidatosWebList]);

    useEffect(() => {
        setContadorTab("candidatos_relacionados", candidatosRelacionadosList.length);
    }, [candidatosRelacionadosList]);

    useEffect(() => {
        setContadorTab("candidatos_descartados", candidatosDescartadosList.length);
    }, [candidatosDescartadosList]);

    useEffect(() => {
        setContadorTab("historico_pesquisas", pesquisasVaga.length);
    }, [pesquisasVaga]);

    return (
        <>
            <div className="col-span-12">
                <PageTabs pageTabs={pageTabs} onClick={changeTab} wordWrap={true} />
            </div>
            <div className="col-span-12 min-h-[400px] relative">
                <CandidatosRelacionados
                    nrVaga={nrVagaClienteCtx}
                    data={candidatosRelacionadosList}
                    active={pageTabs.find((tab) => tab.id === "candidatos_relacionados")?.active}
                    refreshList={refreshList}
                    tabName={tabName}
                    atualizaDetalhesVaga={atualizaDetalhesVaga}
                    situacaoVaga={situacaoVaga}
                />
                <CandidatosWeb
                    data={candidatosWebList}
                    active={pageTabs.find((tab) => tab.id === "candiatos_web")?.active}
                    refreshList={refreshList}
                    tabName={tabName}
                    situacaoVaga={situacaoVaga}
                />
                <CandidatosDescartados
                    data={candidatosDescartadosList}
                    active={pageTabs.find((tab) => tab.id === "candidatos_descartados")?.active}
                    tabName={tabName}
                />
                <PesquisasVaga
                    data={pesquisasVaga}
                    nrVaga={nrVagaClienteCtx}
                    active={pageTabs.find((tab) => tab.id === "historico_pesquisas")?.active}
                    onSetVagaDetalheOnView={onSetVagaDetalheOnView}
                    setToggleView={setToggleView}
                    toggleView={toggleView}
                    tabName={tabName}
                />
            </div>
        </>
    );
};

export default CandidatosVaga;
