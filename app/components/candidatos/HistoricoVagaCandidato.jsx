import TableVagasRelacionadoWeb from "@/components/candidatos/tables/TableVagasRelacionadoWeb";
import TableVagasEncaminhado from "@/components/candidatos/tables/TableVagasEncaminhado";
import HistoricoCandidato from "../selecao/entrar/HistoricoCandidato";
import DetalhesVaga from "@/components/selecao/entrar/DetalhesVaga";
import { useCallback, useEffect, useState } from "react";
import ModalGrid from '@/components/Layouts/ModalGrid';
import PageTabs from "@/components/Layouts/PageTabs";
import { empty } from "@/assets/utils";

const HistoticoVagaCandidato = ({ cdPessoaCandidato, nmCandidato, init, modalHisoticoVagaControl, setModalHisoticoVagaControl }) => {
    const defaultPageTabs = [
        {
            name: "Relacionado WEB",
            id: "relacionado_web",
            active: true,
            visible: true,
            vaga: false,
        },
        {
            name: "Encaminhado",
            id: "encaminhado",
            active: false,
            visible: true,
            vaga: false,
        },
        {
            name: "Historico Candidato",
            id: "historico_candidato",
            active: false,
            visible: true,
            vaga: false,
        },
    ];
    const [modalControl, setModalControl] = useState(false);
    const [pageTabs, setPageTabs] = useState(defaultPageTabs);

    const closeModalCallback = () => {
        if (typeof setModalHisoticoVagaControl === "function") {
            setModalHisoticoVagaControl(false);
        }
    }

    useEffect(() => {
        setModalControl(modalHisoticoVagaControl);
    }, [modalHisoticoVagaControl]);

    const addPageTabsFunc = (nmTab) => {
        const tabExists = pageTabs.some((tab) => tab.id == nmTab);

        if (!tabExists) {
            let prevState = [...pageTabs];
            prevState = prevState.map((tab) => {
                return { ...tab, active: false };
            });
            prevState.push({
                name: nmTab,
                id: nmTab,
                active: true,
                visible: true,
                vaga: true,
            });
            setPageTabs(prevState);
        } else {
            setPageTabs(
                pageTabs.map((tab) => {
                    tab.active = tab.id == nmTab;
                    return tab;
                })
            );
        }
    };

    const changeTab = (nmTab) => {
        setPageTabs(
            pageTabs.map((tab) => {
                tab.active = nmTab == tab.id;
                return tab;
            })
        );
    };

    return (
        <>
            <ModalGrid
                height="h-full"
                size="md"
                title="Histórico de vaga do candidato"
                scrollable={false}
                btnCancel={"FECHAR"}
                contentClass={`px-2 py-0`}
                footerClass={`text-right p-3`}
                id={"modal-vagas-relacionado"}
                modalControl={modalControl}
                closeModalCallback={() => {
                    setPageTabs(defaultPageTabs);
                    closeModalCallback();
                }}
                setModalControl={setModalControl}
            >
                <div className="col-span-12 min-h-[400px]">
                    <div className="grid grid-cols-1">
                        <PageTabs pageTabs={pageTabs} onClick={changeTab} wordWrap={true} />
                        <div className={`${pageTabs.find((tab) => tab.id === "relacionado_web").active ? "" : "hidden"}`}>
                            <TableVagasRelacionadoWeb
                                cdPessoaCandidato={cdPessoaCandidato}
                                nmCandidato={nmCandidato}
                                init={init}
                            />
                        </div>
                        <div className={`${pageTabs.find((tab) => tab.id === "encaminhado").active ? "" : "hidden"}`}>
                            <TableVagasEncaminhado
                                addPageTabsFunc={addPageTabsFunc}
                                cdPessoaCandidato={cdPessoaCandidato}
                                nmCandidato={nmCandidato}
                                init={init}
                            />
                        </div>
                        <div className={`${pageTabs.find((tab) => tab.id === "historico_candidato").active ? "" : "hidden"}`}>
                            <HistoricoCandidato
                                active={init}
                                cdPessoaCandidato={cdPessoaCandidato}
                                nmCandidato={nmCandidato}
                                className={"my-2"}
                            />
                        </div>
                        {pageTabs
                            .filter((tab) => tab.vaga)
                            .map((tab) => (
                                <div key={tab.id} className={`max-h-[500px] overflow-y-auto ${tab.active ? "" : "hidden"}`}>
                                    <DetalhesVaga
                                        nmCargo={""}
                                        nrVaga={tab.id}
                                        init={tab.active}
                                        toggleView={tab.id}
                                        disableToggleView={true}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </ModalGrid>
        </>
    );
}
export default HistoticoVagaCandidato;