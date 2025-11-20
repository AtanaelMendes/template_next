import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import DadosAgendamento from "../selecao/entrar/DadosAgendamento";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TooltipComponent } from "../Layouts/TooltipComponent";
import { Caption } from "@/components/Layouts/Typography";
import Vaga from "@/components/vagas/Vaga";
import { useCallback, useEffect, useState } from "react";
import Clipboard from '@/components/Layouts/Clipboard';
import VagaResumida from "../candidatos/VagaResumida";
import { useAppContext } from "@/context/AppContext";
import NoDataFound from "../Layouts/NoDataFound";
import ModalGrid from "../Layouts/ModalGrid";
import Button from "../buttons/Button";
import { cn } from "@/assets/utils";
import Loading from "../Layouts/Loading";

const TableVagasPorTipo = ({ data, active, reload, reloadDataFunction, ready, setReady }) => {
    let timeoutIdVaga = null;
    const [listaVagas, setListaVagas] = useState([]);
    const [nrVagaOnView, setNrVagaOnView] = useState("");
    const [modalAgendamento, setmodalAgendamento] = useState(false);
    const [salvarAgendamento, setsalvarAgendamento] = useState(false);
    const [formAgendamento, setformAgendamento] = useState({
        cd_pessoa: "",
        nm_pessoa: "",
    });

    const { user, addTabWithComponent, sendWebSocketMessage } = useAppContext();

    useEffect(() => {
        if (data) {
            setListaVagas(data);
        }
    }, [data]);

    useEffect(() => {
        setReady(true);
    }, [listaVagas]);

    useEffect(() => {
        if (active && reload) {
            reloadDataFunction();
        }
    }, [reload]);

    const handleAgendar = (data) => {
        setformAgendamento({
            cd_pessoa_cliente: data.CD_PESSOA_CLIENTE,
            nm_pessoa_cliente: data.NM_PESSOA_CLIENTE,
            cd_usuario_analista: data.CD_PESSOA_SELECIONADOR,
            nm_pessoa_analista: data.NM_PESSOA_SELECIONADOR,
        });
        setmodalAgendamento(true);
    };

    const vagaResumidaCallback = () => {
        setNrVagaOnView("");
    };

    const handleMouseEnterVaga = (nrVaga) => {
        timeoutIdVaga = setTimeout(() => {
            setNrVagaOnView(nrVaga);
        }, 1000);
    };

    const handleMouseLeaveVaga = () => {
        clearTimeout(timeoutIdVaga);
    };

    const handleClickVaga = (nrVaga) => {
        addTabWithComponent(
            'tab_' + nrVaga,
            'Vaga ' + nrVaga,
            <Vaga
                nrVaga={nrVaga}
                init={true}
                enableEdit={true}
                toggleView={nrVaga}
                isRecrutamento={true}
                disableToggleView={true}
            />
        );
    };

    const clearModalContent = useCallback(() => {
        setmodalAgendamento(false);
        setformAgendamento({});
    }, []);

    const afterSaveCallback = () => {
        clearModalContent();
        reloadDataFunction();
        sendWebSocketMessage('agenda', user.user_sip);
    };

    const insereEspacoNome = (string) => {
        if (!string) {
            return '-';
        }

        return string.replaceAll(',', ', ').replaceAll(':', ': ');
    };

    const modalActions = () => (
        <Button className="mx-2" buttonType="success" onClick={() => setsalvarAgendamento(true)}>
            SALVAR
        </Button>
    );

    return (
        <div className={cn("shadow-md bg-white py-2 min-h-[445px] max-h-[64vh] overflow-y-auto pb-[100px] border-t", active ? '' : 'hidden')}>
            <Loading active={!ready} />
            {listaVagas.map((row, index) => (
                <div key={row.CD_PESSOA_CANDIDATO + '-' + row.NR_VAGA} className={`pb-1 px-4 border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
                    <div className="grid grid-cols-12 gap-2 text-sm items-center">
                        <div className="col-span-4">
                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Vaga: </Caption>
                                <Clipboard className={'ml-1 text-primary font-semibold cursor-pointer hover:underline'} textToStore={row.NR_VAGA} >
                                    <span
                                        onMouseEnter={() =>
                                            handleMouseEnterVaga(row.NR_VAGA)
                                        }
                                        onMouseLeave={handleMouseLeaveVaga}
                                        onClick={() => {
                                            handleMouseLeaveVaga(); //Não abrir o resumo da vaga ao clicar
                                            handleClickVaga(row.NR_VAGA);
                                        }}
                                    >
                                        {row.NR_VAGA}
                                    </span>
                                </Clipboard>
                            </div>

                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Analista: </Caption>
                                <span className="ml-1 text-nowrap truncate">{row.NM_PESSOA_SELECIONADOR}</span>
                            </div>

                            <div className="flex flex-row">
                                <Caption className={"mt-1"} >Status: </Caption>
                                <span className="ml-1 text-nowrap truncate">{row.NM_SITUACAO_VAGA}</span>
                            </div>
                        </div>

                        <div className="col-span-3">
                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Cidade: </Caption>
                                    <TooltipComponent content={insereEspacoNome(row.NM_CIDADE)} asChild>
                                        <span className="ml-1 mt-0.5 truncate">{insereEspacoNome(row.NM_CIDADE)}</span>
                                    </TooltipComponent>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Bairro: </Caption>
                                    <TooltipComponent content={insereEspacoNome(row.NM_BAIRRO)} asChild>
                                        <span className="ml-1 mt-0.5 truncate">{insereEspacoNome(row.NM_BAIRRO)}</span>
                                    </TooltipComponent>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Sexo: </Caption>
                                    <span className="ml-1 mt-0.5">{row.ID_SEXO ?? '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4">
                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Cliente: </Caption>
                                    <TooltipComponent content={row.NM_PESSOA_CLIENTE} asChild>
                                        <span className="ml-1 mt-0.5 truncate">{row.NM_PESSOA_CLIENTE}</span>
                                    </TooltipComponent>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Cargo: </Caption>
                                    <TooltipComponent content={row.NM_CARGO} asChild>
                                        <span className="ml-1 mt-0.5 truncate">{row.NM_CARGO}</span>
                                    </TooltipComponent>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-row">
                                    <Caption className={"mt-1"} >Escolaridade: </Caption>
                                    <span className="ml-1 text-nowrap truncate">{row.NM_GRAU_INSTRUCAO_DE ?? '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex justify-end gap-2">
                                <TooltipComponent content={"Agendar"} asChild>
                                    <button
                                        onClick={() => handleAgendar(row)}
                                        className=" px-2 py-2 rounded text-primary border border-slate-300 hover:bg-gray-100"
                                    >
                                        <FontAwesomeIcon icon={faCalendarDays} width={"16"} height={"16"} />
                                    </button>
                                </TooltipComponent>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <VagaResumida
                mostrarPerfil={true}
                nrVaga={nrVagaOnView}
                closeCallback={vagaResumidaCallback}
            />

            <ModalGrid
                modalControl={modalAgendamento}
                setModalControl={setmodalAgendamento}
                size="sm"
                height="h-full"
                btnCancel="CANCELAR"
                title={`${formAgendamento.isEdit ? "Editar" : "Novo"} Agendamento`}
                footer={modalActions()}
                footerClass={`text-right`}
                closeModalCallback={clearModalContent}
            >
                <DadosAgendamento
                    isNew={true}
                    isEdit={false}
                    isFromCandidato={false}
                    isFromRecrutamento={true}
                    active={modalAgendamento}
                    handleSave={salvarAgendamento}
                    handleSaveFn={setsalvarAgendamento}
                    afterSaveCallback={afterSaveCallback}
                    cdPessoa={formAgendamento.cd_pessoa}
                    nmPessoa={formAgendamento.nm_pessoa}
                    cdPessoaCliente={formAgendamento.cd_pessoa_cliente}
                    nmCliente={formAgendamento.nm_pessoa_cliente}
                    cdUsuarioAnalista={formAgendamento.cd_usuario_analista}
                    nmPessoaAnalista={formAgendamento.nm_pessoa_analista}
                    triggerClearFields={!modalAgendamento}
                />
            </ModalGrid>

            {Object.keys(listaVagas)?.length === 0 && <NoDataFound />}
        </div>
    );
};

export default TableVagasPorTipo;