import { faHistory, faLeftRight, faRightLong, faSearch, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoDataFound from '@/components/Layouts/NoDataFound';
import PillsBadge from '@/components/buttons/PillsBadge';
import ModalGrid from '@/components/Layouts/ModalGrid';
import InputText from '@/components/inputs/InputText';
import { useAppContext } from '@/context/AppContext';
import Button from '@/components/buttons/Button';
import axiosInstance from '@/plugins/axios';
import { Dropdown } from 'flowbite-react';
import { cn, empty } from '@/assets/utils';
import { Fragment } from 'react';
import {
    AnimatedAccordion,
    AnimatedAccordionContent,
    AnimatedAccordionHeader,
    AnimatedAccordionItem,
} from '@/components/Layouts/AnimatedAccordion';
import WhatsAppChat from '@/components/chatbot/WhatsappChat';
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import CandidatosDescartadosPesquisa from './CandidatosDescartadosPesquisa';

const PesquisasVaga = ({
    data,
    active,
    onToggleViewPesquisa,
    onSetVagaDetalheOnView,
    toggleView,
    setToggleView,
    nrVaga,
    tabName
}) => {
    const {user, toast, getHistoricoPesquisas, coletaInfosPesquisa, historicoPesquisaReady } = useAppContext();
    const [filter, setFilter] = useState({ filtro_pesquisas: '' });
    const [showModalEnvioCandidatoNormal, setShowModalEnvioCandidatoNormal] = useState({
        show: false,
        pesquisa: null,
    });
    const [showModalEnvioCandidatoChatbot, setShowModalEnvioCandidatoChatbot] = useState({
        show: false,
        pesquisa: null,
    });
    const [retornoChatbot, setRetornoChatbot] = useState(null);
    const [statusRetornoChatbot, setStatusRetornoChatbot] = useState(null);
    const [logsChatbot, setLogsChatbot] = useState(null);
    const [chatbotCandidatoView, setChatbotCandidatoView] = useState(false);
    const [liberaChatbotJoinville, setLiberaChatbotJoinville] = useState(false);
    const [historicoChatbotReady, setHistoricoChatbotReady] = useState(false);
    const [modalCandidatosDescartados, setModalCandidatosDescartados] = useState(false);
    const [nrSelecao, setNrSelecao] = useState(null);

    const unidadesJoinville = [1, 101, 201, 19, 119, 219, 330, 145, 45, 430];
    useEffect(() => {
        setLiberaChatbotJoinville(unidadesJoinville.includes(Number(user.cd_unid)));
    }, [user]);

    const setFilterTextCallback = (id, value) => {
        setFilter({ [id]: value });
    };

    const pesquisasVaga = useMemo(() => {
        if (!data) return [];
        return data.filter((item) =>
            Object.values(item).some(
                (v) =>
                    typeof v === "string" &&
                    v.toLowerCase().includes(filter.filtro_pesquisas.toLowerCase())
            )
        );
    }, [data, filter]);

    useEffect(() =>{
        setModalCandidatosDescartados(nrSelecao != null)
    }, [nrSelecao])

    function handleOnClickShowModalEnvioCandidatoNormal(nr_selecao) {
        const pesquisa = pesquisasVaga.find(pesquisa => pesquisa.NR_SELECAO === nr_selecao);

        setShowModalEnvioCandidatoNormal({
            show: true,
            pesquisa: pesquisa,
        });
    }

    function handleOnClickShowModalEnvioCandidatoChatbot(nr_selecao) {
        const pesquisa = pesquisasVaga.find(pesquisa => pesquisa.NR_SELECAO === nr_selecao);

        setShowModalEnvioCandidatoChatbot({
            show: true,
            pesquisa: pesquisa,
        });
    }

    async function enviarAnuncioCandidatoNormal(nrSelecao) {
        try {
            await axiosInstance.post(`candidato/envio-anuncio-candidato/${nrSelecao}`);
            getHistoricoPesquisas();
            coletaInfosPesquisa(nrSelecao, nrVaga);
            setShowModalEnvioCandidatoNormal({ show: false, pesquisa: null });
        } catch (error) {
            console.error(error);
            toast.error(error || 'Não foi possível enviar os candidatos.');
        }
    }

    const ErrorMessageFormatter = ({ errorMessage }) => {
        // Remove prefixos conhecidos, como "Erro ao iniciar conversas" ou "Erro ao iniciar conversas com os seguintes candidatos"
        const cleanMessage = errorMessage.replace(/^Erro ao iniciar conversas(?: com os seguintes candidatos)?:\s*/, '');

        const candidates = [];
        const candidateStrings = cleanMessage.split(';').filter(str => str.trim());

        for (const candidateStr of candidateStrings) {
            const nameMatch = candidateStr.match(/Candidato: (.*?), Erro:/);
            const errorMatch = candidateStr.match(/Erro: (.*)/);

            if (nameMatch && errorMatch) {
                candidates.push({
                    name: nameMatch[1].trim(),
                    error: errorMatch[1].trim(),
                });
            }
        }

        // Se não houver candidatos identificados, exibe a mensagem de erro completa
        if (candidates.length === 0) {
            return (
                <div className="space-y-2 rounded-md p-2 border border-border text-sm text-red-600">
                    <p className="font-medium">Erro:</p>
                    <p>{cleanMessage}</p>
                </div>
            );
        }

        // Caso contrário, exibe os erros extraídos para cada candidato
        return (
            <AnimatedAccordion className='w-full'>
                <AnimatedAccordionItem>
                    <AnimatedAccordionHeader>
                        Exibir informações dos candidatos com{' '}
                        <span className='text-red-600'>erro: ({candidates.length})</span>
                    </AnimatedAccordionHeader>
                    <AnimatedAccordionContent>
                        <p className='font-medium text-base'>Erro ao iniciar conversas:</p>
                        {candidates.map((candidate, index) => (
                            <Fragment key={index}>
                                <p className='font-medium text-sm text-red-600'>{candidate.name}</p>
                                <p className='text-sm text-red-600'>{candidate.error}</p>
                            </Fragment>
                        ))}
                    </AnimatedAccordionContent>
                </AnimatedAccordionItem>
            </AnimatedAccordion>
        );
    };

    async function enviarMensagemChatbot(nrSelecao) {
        setRetornoChatbot(
            <span className='text-sm text-gray-600 rounded-md p-2 border border-border'>Enviando...</span>
        );

        await axiosInstance
            .post(`candidato/comecar-conversas-chatbot/${nrSelecao}`)
            .then(response => {
                // A mensagem de sucesso agora vem em response.data.message
                toast.success(response.data.message);
                setStatusRetornoChatbot(true);

                const candidatosEnviados = response.data.candidatosEnviados || [];
                const candidatosErros = response.data.candidatosErros || [];

                const mensagem = (
                    <AnimatedAccordion className='w-full'>
                        {candidatosEnviados.length > 0 && (
                            <AnimatedAccordionItem>
                                <AnimatedAccordionHeader>
                                    Exibir informações dos candidatos{' '}
                                    <span className='text-green-600'>enviados ({candidatosEnviados.length})</span>
                                </AnimatedAccordionHeader>
                                <AnimatedAccordionContent>
                                    <span className='text-sm text-green-600 rounded-md p-2'>
                                        {candidatosEnviados.join(', ')}
                                    </span>
                                </AnimatedAccordionContent>
                            </AnimatedAccordionItem>
                        )}
                        {candidatosErros.length > 0 && (
                            <AnimatedAccordionItem>
                                <AnimatedAccordionHeader>
                                    Exibir informações dos candidatos com{' '}
                                    <span className='text-red-600'>erro: ({candidatosErros.length})</span>
                                </AnimatedAccordionHeader>
                                <AnimatedAccordionContent>
                                    <span className='text-sm text-red-600 rounded-md p-2'>
                                        {candidatosErros.map((candidato, index) => (
                                            <Fragment key={index}>
                                                <p className='font-medium text-sm text-red-600'>
                                                    {candidato.nome_candidato}
                                                </p>
                                                <p className='text-sm text-red-600'>{candidato.erro}</p>
                                            </Fragment>
                                        ))}
                                    </span>
                                </AnimatedAccordionContent>
                            </AnimatedAccordionItem>
                        )}
                    </AnimatedAccordion>
                );

                setRetornoChatbot(mensagem);
            })
            .catch(err => {
                console.error(err);
                setStatusRetornoChatbot(false);
                const errorMessage =
                    (err.response?.data?.error) || 'Erro desconhecido';
                setRetornoChatbot(<ErrorMessageFormatter errorMessage={errorMessage} />);
            });
    }

    const coletaInfoPesquisa = (nrSelecao) => {
        coletaInfosPesquisa(nrSelecao, nrVaga);
        onSetVagaDetalheOnView(nrVaga);

        if (setToggleView) {
            setToggleView(toggleView === nrVaga ? toggleView : nrVaga);
        }

        if (onToggleViewPesquisa) {
            onToggleViewPesquisa();
        }

        setTimeout(() => {
            const elementToScroll = document.getElementById(`detalhe-vaga-${nrVaga}`);
            if (elementToScroll) {
                elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    const dataToHtml = () => {
        if (pesquisasVaga?.length <= 0) return <NoDataFound isLoading={!historicoPesquisaReady}/>;

        return pesquisasVaga?.map((pesquisa) => {
            return (
                <div
                    className="flex flex-row flex-wrap odd:bg-white even:bg-gray-200 border-b border-slate-300 gap-0.5 xl:gap-1 py-1 text-sm xl:text-base items-center relative w-full pl-[34px]"
                    key={pesquisa.NR_SELECAO}
                >
                    <div className="absolute h-full content-center left-0">
                        <Button
                            pill
                            size="small"
                            buttonType="primary"
                            outline
                            className={"py-2"}
                            onClick={() => {
                                coletaInfoPesquisa(pesquisa.NR_SELECAO);
                            }}
                        >
                            <FontAwesomeIcon icon={faSearch} width="16" height="16" />
                        </Button>
                    </div>

                    <div className="flex flex-row flex-nowrap items-center">
                        <div className="w-[70px] text-xs text-slate-500">
                            NR Seleção:
                        </div>
                        <div className="w-[70px] text-primary">
                            {pesquisa.NR_SELECAO}
                        </div>
                    </div>

                    <div className="flex flex-row flex-nowrap items-center">
                        <div className="w-[70px] text-xs text-slate-500">
                            Candidatos:
                        </div>
                        <div className="w-[30px] text-primary">
                            {pesquisa.SOMA}
                        </div>
                        
                        {pesquisa.CANDIDATOS_DESCARTADOS > 0 && (

                            <div className="flex flex-row flex-nowrap">
                                <div className='text-slate-500 pr-2'> / </div>
                                <TooltipComponent content={<span className="font-semibold">Candidatos descartados na pesquisa</span>}>
                                    <div className="pr-3 text-danger font-semibold hover:underline" onClick={()=> setNrSelecao(pesquisa.NR_SELECAO)}>
                                        {pesquisa.CANDIDATOS_DESCARTADOS}
                                    </div>
                                </TooltipComponent>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row flex-nowrap items-center mr-2">
                        <div className="w-[70px] text-xs text-slate-500">
                            Criado Por:
                        </div>
                        <div className="w-fit">
                            {pesquisa.NM_USUARIO}
                        </div>
                    </div>

                    <div className="flex flex-row flex-nowrap items-center">
                        <div className="w-[70px] text-xs text-slate-500">
                            Criado Em:
                        </div>
                        <div className="w-[140px] italic">
                            {pesquisa.CRIADO_EM}
                        </div>
                    </div>

                    {/* Se for analista... */}
                    {(!empty(pesquisa.POSSUI_ENVIO_CANDIDATO)) && (
                        <div className="flex flex-row flex-nowrap items-center">
                            <div>
                                <Dropdown
                                    label=''
                                    renderTrigger={() => (
                                        <span className='p-2 rounded-full flex h-fit w-fit group-odd:hover:bg-gray-200 group-even:hover:bg-gray-300 cursor-pointer'>
                                            <FontAwesomeIcon
                                                icon={faShareNodes}
                                                width='16'
                                                height='16'
                                                className={cn(pesquisa.ENVIO_DE_CONTATO.length > 0 ? 'text-green-500' : 'text-red-500')}/>
                                        </span>
                                    )}
                                >
                                    {liberaChatbotJoinville && <Dropdown.Item
                                        disabled={
                                            pesquisa.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) === 10)
                                        }
                                        onClick={() => handleOnClickShowModalEnvioCandidatoChatbot(pesquisa.NR_SELECAO)}
                                        className={cn(
                                            'flex justify-between',
                                            pesquisa.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) === 10) &&
                                            'disabled:opacity-50 disabled:cursor-not-allowed'
                                        )}
                                    >
                                        Chatbot
                                    </Dropdown.Item>}
                                    {!empty(pesquisa.POSSUI_ENVIO_CANDIDATO) && <Dropdown.Item
                                        disabled={
                                            pesquisa.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) !== 10)
                                        }
                                        onClick={() => handleOnClickShowModalEnvioCandidatoNormal(pesquisa.NR_SELECAO)}
                                        className={cn(
                                            'flex justify-between',
                                            pesquisa.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) !== 10) &&
                                            'disabled:opacity-50 disabled:cursor-not-allowed'
                                        )}
                                    >
                                        Normal
                                    </Dropdown.Item>}
                                </Dropdown>
                            </div>
                            {(pesquisa.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) === 10)) && liberaChatbotJoinville && <div>
                                <Button  outline onClick={() => handleOnClickShowModalEnvioCandidatoChatbot(pesquisa.NR_SELECAO)}>
                                    <FontAwesomeIcon icon={faHistory} width="16" height="16" className="text-primary"/>
                                </Button>
                            </div>}
                        </div>
                    )}
                </div>
            );
        });
    };

    const getConversasPorSelecaoFluxoVagaPerfilCandidato = async nrSelecao => {
        setHistoricoChatbotReady(false);
        axiosInstance.get(`chatbot/conversas-status/${nrSelecao}`)
            .then(function (response) {
                setLogsChatbot(response.data);
            }).catch(function (resp) {
                console.error(resp)
                let error = resp?.response?.data?.error
                if (Array.isArray(error)) {
                    return toast.error(error.join(' ') || 'OOps ocorreu um erro ao buscar o histórico chatbot')
                }
                return toast.error(error || 'OOps ocorreu um erro ao buscar o histórico chatbot')
            }).finally(_foo => setHistoricoChatbotReady(true));
    };

    function closeModal() {
        setShowModalEnvioCandidatoChatbot({ show: false, pesquisa: null });
        setRetornoChatbot(null);
        setStatusRetornoChatbot(false);
        setLogsChatbot(null);
        setChatbotCandidatoView(null);
    }

    useEffect(() => {
        if (showModalEnvioCandidatoChatbot?.pesquisa?.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) === 10)) {
            setStatusRetornoChatbot(true);
            getConversasPorSelecaoFluxoVagaPerfilCandidato(
                showModalEnvioCandidatoChatbot.pesquisa.NR_SELECAO
            );
        }
    }, [showModalEnvioCandidatoChatbot]);

    if (!active) return null;

    return (
        <>
            <div className={`grid grid-cols-12 pr-2 bg-white ${active ? " " : "hidden"}`}>
                <div className="col-span-12 px-2 shadow-lg z-20">
                    <div className="grid grid-cols-12 py-2">
                        <div className="col-start-7 col-span-6">
                            <InputText
                                placeholder="Filtrar"
                                onChange={setFilterTextCallback}
                                id="filtro_pesquisas"
                                clearable={true}
                                helperText={`Exibindo ${pesquisasVaga.length} registros`}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-12 max-h-[400px] xl:max-h-[500px] overflow-y-auto pb-100">{dataToHtml()}</div>
            </div>

            <ModalGrid
                id='modalWhatsapp'
                title='Enviar mensagem'
                modalControl={showModalEnvioCandidatoNormal.show}
                closeModalCallback={() =>
                    setShowModalEnvioCandidatoNormal({ show: false, pesquisa: null })
                }
                className='m-6'
                btnCancel='Cancelar'
                footerClass='text-right'
                btnSubmit='Enviar'
                height={'h-fit'}
                width={'w-1/4'}
                submitCallBack={() =>
                    enviarAnuncioCandidatoNormal(showModalEnvioCandidatoNormal.pesquisa.NR_SELECAO)
                }
            >
                <div className='flex justify-center p-6 text-center'>
                    Você está prestes a enviar mensagem, via e-mail, SMS e WhatsApp, para os candidatos desta
                    pesquisa.
                </div>
            </ModalGrid>

            <ModalGrid
                title="Candidatos descartados"
                btnCancel={"FECHAR"}
                footerClass={`text-left`}
                height="max-h-[500px]"
                width="max-w-[1500px] min-w-[600px]"
                id={"modalDescartados"}
                modalControl={modalCandidatosDescartados}
                closeModalCallback={() => {setNrSelecao(null)}}
            >
                <div className="col-span-12 min-h-[400px]">
                    <CandidatosDescartadosPesquisa nrVaga={nrVaga} nrSelecao={nrSelecao} tabName={tabName}/>
                </div>
            </ModalGrid>

            <ModalGrid
                id='modalWhatsapp2'
                scrollable={false}
                title={"Histórico Chatbot"}
                modalControl={showModalEnvioCandidatoChatbot.show}
                closeModalCallback={() => closeModal()}
                btnCancel='Cancelar'
                footerClass='text-right'
                btnSubmit={statusRetornoChatbot ? null : 'Enviar'}
                size={'lg'}
                submitCallBack={() => enviarMensagemChatbot(showModalEnvioCandidatoChatbot.pesquisa.NR_SELECAO)}
            >
                {showModalEnvioCandidatoChatbot?.pesquisa?.ENVIO_DE_CONTATO?.find((tipo) => Number(tipo.CD_TIPO_ENVIO) === 10) ? (
                    <div className='flex flex-row w-full h-full gap-1 xl:gap-2'>
                        <div className='flex flex-col gap-1 xl:gap-2 grow overflow-y-auto'>
                            {!historicoChatbotReady && <NoDataFound isLoading={!historicoChatbotReady}/>}
                            {historicoChatbotReady && empty(logsChatbot) && <NoDataFound/>}
                            {historicoChatbotReady && logsChatbot?.map((log, index) => (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                <div
                                    key={log.ID_CHATBOT_CONVERSA}
                                    className='flex flex-row py-1 xl:py-2 gap-x-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer'
                                    onClick={() => setChatbotCandidatoView(log)}
                                >
                                    <div className='text-base font-semibold'>
                                        {log.NOME_CANDIDATO}
                                        <div className='flex flex-row gap-x-2'>
                                            <div>
                                                <PillsBadge type={log.ID_STATUS_TYPE} className='text-xs'>
                                                    {log.DS_STATUS_CONVERSA}
                                                </PillsBadge>
                                            </div>
                                            <div>
                                                <PillsBadge type={"primary"} className='text-xs'>
                                                    Iniciado: {log.DT_INICIO_CONVERSA}
                                                </PillsBadge>
                                            </div>
                                        </div>
                                    </div>
                                    {(log.ID_CHATBOT_CONVERSA === chatbotCandidatoView?.ID_CHATBOT_CONVERSA) && <div className='text-primary'>
                                        <FontAwesomeIcon icon={faRightLong} width="30" height="30" className="animate-bounce"/>
                                    </div>}
                                </div>
                            ))}
                        </div>
                        <WhatsAppChat visible={!empty(chatbotCandidatoView?.NODES)} messages={chatbotCandidatoView?.NODES} className="w-[44%]"/>
                    </div>
                ) : (
                    <>
                        <div className='flex justify-center p-6 text-center flex-col gap-2'>
                            Você está prestes a enviar uma mensagem WhatsApp, via chatbot, para os candidatos
                            desta pesquisa. O custo estimado será de{' '}
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                showModalEnvioCandidatoChatbot.pesquisa?.SOMA * 0.35
                            )}
                            .
                            <span className='text-sm text-gray-400'>
                                (Esse custo é variavel, podendo ser maior ou menor)
                            </span>
                        </div>
                        {retornoChatbot && (
                            <div className='flex justify-center p-1 text-center'>{retornoChatbot}</div>
                        )}
                    </>
                )}
            </ModalGrid>
        </>
    );
};

export default PesquisasVaga;


