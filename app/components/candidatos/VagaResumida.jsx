import { Caption, Subtitle, Title, Label } from "@/components/Layouts/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import NoDataFound from "../Layouts/NoDataFound";
import axiosInstance from "@/plugins/axios";
import Button from "../buttons/Button";
import { cn, empty } from "@/assets/utils";
import PillsBadge from "@/components/buttons/PillsBadge";

const VagaResumida = ({ nrVaga, mostrarPerfil, closeCallback }) => {
    const [dadosVaga, setDadosVaga] = useState({});
    const [dadosPerfil, setDadosPerfil] = useState({});
    const { toast } = useAppContext();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!nrVaga) return;

        setReady(false);
        axiosInstance.get('/vaga/dados-vaga-resumida/' + nrVaga)
            .then((response) => {
                setDadosVaga(response.data.VAGA);
                setDadosPerfil(response.data.PERFIL);
                setReady(true);
            })
            .catch((error) => {
                setReady(false);
                if (error?.text) {
                    return toast.error(error?.text);
                }
                return toast.error("Erro ao buscar dados da vaga.");
            });
    }, [nrVaga]);

    const handleClose = () => {
        if (typeof closeCallback === "function") {
            closeCallback();
        }
    };

    const quebrarLinha = (str) => {
        if (typeof str !== "string") {
            return "";
        }

        return str.replace(/\n/g, "<br>");
    }

    const getFaixaEtaria = (min, max) => {
        min = parseInt(min);
        max = parseInt(max) || 0;

        if (max < 1) {
            return min > 0 ? `${min} anos ou mais` : 'Não informado';
        }

        if (min > 0) {
            return `${min} a ${max} anos`;
        }

        return `Menos de ${max} anos`;
    }

    const getEscolaridade = (min, max) => {
        if (!min && !max) return 'Não informado';

        if (min && !max) {
            return `A partir de ${min}`;
        }

        if (!min && max) {
            return `Até ${max}`;
        }

        if (min === max) {
            return `${min}`;
        }

        return `${min} a ${max}`;
    }

    const getTempoExperiencia = (min, max) => {
        min = parseInt(min);
        max = parseInt(max);

        if (!min && !max) return 'Não informado';

        if (min && !max) {
            return `${min} ${min === 1 ? 'ano' : 'anos'} ou mais`;
        }

        if (!min && max) {
            return `Até ${max} ${max === 1 ? 'ano' : 'anos'}`;
        }

        if (min === max) {
            return `${min} ${min === 1 ? 'ano' : 'anos'}`;
        }

        return `${min} a ${max} anos`;
    }

    const ajustaNomeBairros = (string) => {
        if (!string) {
            return 'Não informado';
        }

        let parts = string.split(',');
        let cidadeTmp = parts[0].split(':')[0];
        const cidade = cidadeTmp.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

        const bairros = parts.map(item => {
            const bairro = item.split(':')[1];
            return bairro
                .toLowerCase()
                .replace(/\b\w/g, c => c.toUpperCase());
        })

        return `${cidade}: ${bairros.join(', ')}`;
    };

    const vagaToHtml = useMemo(() => {
        if (Object.keys(dadosVaga)?.length === 0) {
            return <NoDataFound isLoading={ready}/>
        };

        return (
            <>
                <div className="max-h-full overflow-y-auto">
                    <div className="flex-col px-2 pl-4">
                        <div className="flex-row mt-2 text-center text-slate-700 border-b border-slate-300 pb-2">
                            <Title>{`Resumo da vaga - ${dadosVaga.NR_VAGA}`}</Title>
                            {dadosVaga?.ID_VAGA_SIGILOSA == 'S' && (
                                <PillsBadge
                                    type="danger"
                                    className="inline-flex items-center ml-2">
                                    Sigilosa
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        width="12"
                                        height="12"
                                        className='ml-1'
                                    />
                                </PillsBadge>
                            )}
                            {dadosVaga?.ID_VAGA_CONFIDENCIAL == 'S' && (
                                <PillsBadge
                                    type="danger"
                                    className="inline-flex items-center ml-2">
                                    Confidencial
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        width="12"
                                        height="12"
                                        className='ml-1'
                                    />
                                </PillsBadge>
                            )}
                        </div>
                        <div className="grid grid-cols-12">
                            <div className={cn('col-span-6', dadosVaga?.NM_PESSOA_SELECIONADOR ? "" : "hidden")}>
                                <Caption>Analista:</Caption> <Label>{dadosVaga.NM_PESSOA_SELECIONADOR}</Label>
                            </div>
                            <div className={cn('col-span-6', dadosVaga?.DT_ABERTURA ? "" : "hidden")}>
                                <Caption>Aberta em:</Caption> <Label className={'italic'}>{dadosVaga.DT_ABERTURA}</Label>
                            </div>
                        </div>
                        <div className="border-t border-slate-300">
                            <Label className={"text-slate-600 text-base"}>Cliente</Label>
                        </div>
                        <div className="grid grid-cols-12 pl-2">
                            <div className={cn('col-span-12', dadosVaga?.NM_PESSOA_CLIENTE ? "" : "hidden")}>
                                <Label className={"font-semibold text-sm text-slate-800"}>{dadosVaga.NM_PESSOA_CLIENTE}</Label>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.ENDERECO_CLIENTE ? "" : "hidden")}>
                                <Label>{dadosVaga.ENDERECO_CLIENTE}</Label>
                            </div>
                        </div>
                        <div className="border-t border-slate-300">
                            <Label className={"text-slate-600 text-base"}>Cargo</Label>
                        </div>
                        <div className="grid grid-cols-12 pl-2">
                            <div className={cn('col-span-12', dadosVaga?.NM_CARGO ? "" : "hidden")}>
                                <Label className={"font-semibold text-sm text-slate-800"}>{dadosVaga.NM_CARGO}</Label>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.NM_TURNO ? "" : "hidden")}>
                                <Caption>Horário:</Caption> <Label>{dadosVaga.NM_TURNO}</Label>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.CD_CENTRO_CUSTO ? "" : "hidden")}>
                                <Caption>Centro de Custo:</Caption> <Label>{dadosVaga.CD_CENTRO_CUSTO}</Label>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.SALARIO ? "" : "hidden")}>
                                <Caption>Salário:</Caption> <Label>{"R$ " + dadosVaga.SALARIO}</Label>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.ID_TIPO_CONTRATACAO ? "" : "hidden")}>
                                <Caption>Tipo de Contratação:</Caption> <Label>{dadosVaga.ID_TIPO_CONTRATACAO}</Label>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.DS_ATIVIDADES_ESTAGIO ? "" : "hidden")}>
                                <div>
                                    <Caption>Descrição das Atividades: </Caption>
                                </div>
                                <div
                                    className={`border rounded p-2 text-sm text-justify text-slate-900 pl-2 pr-6 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5`}
                                    dangerouslySetInnerHTML={{ __html: quebrarLinha(dadosVaga.DS_ATIVIDADES_ESTAGIO) }}>
                                </div>
                            </div>
                            <div className={cn('col-span-12', dadosVaga?.DS_OBSERVACOES ? "" : "hidden")}>
                                <div>
                                    <Caption>Informações Adicionais ou Sigilosas:</Caption>
                                </div>
                                <div
                                    className={`border rounded p-2 text-sm text-justify text-slate-900 pl-2 pr-6 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5`}
                                    dangerouslySetInnerHTML={{ __html: quebrarLinha(dadosVaga.DS_OBSERVACOES) }}>
                                </div>
                            </div>
                        </div>
                    </div>

                    {mostrarPerfil && (<div className={cn("mt-4")}>
                        <div className="flex-row mt-2 text-center text-slate-700 border-b border-t pt-2 border-slate-300 pb-2">
                            <span class="font-semibold text-slate-600">Perfil da vaga</span>
                        </div>
                        <div className="flex-col px-2 pl-4">
                            <div className="grid grid-cols-12">
                                <div className={cn('col-span-6')}>
                                    <Caption>Sexo:</Caption> <Label>{dadosPerfil.ID_SEXO || "Não informado"}</Label>
                                </div>
                                <div className={cn('col-span-6')}>
                                    <Caption>Idade:</Caption> <Label>{getFaixaEtaria(dadosPerfil.NR_IDADE_DE, dadosPerfil.NR_IDADE_ATE)}</Label>
                                </div>
                                <div className={cn('col-span-12')}>
                                    <Caption>Experiência:</Caption> <Label>{getTempoExperiencia(dadosPerfil.NR_ANOS_EXPERIENCIA_DE, dadosPerfil.NR_ANOS_EXPERIENCIA_ATE)}</Label>
                                </div>
                                <div className={cn('col-span-12')}>
                                    <Caption>Escolaridade:</Caption> <Label>{getEscolaridade(dadosPerfil.NM_GRAU_INSTRUCAO_DE, dadosPerfil.NM_GRAU_INSTRUCAO_ATE)}</Label>
                                </div>
                                <div className={cn('col-span-12')}>
                                    <Caption>Bairro(s):</Caption> <Label>{ajustaNomeBairros(dadosPerfil.NM_BAIRRO)}</Label>
                                </div>
                            </div>
                        </div>
                    </div>)}
                    {/* Espaço adicional para os botões não esconderem o conteudo */}
                    <div className="flex flex-col pb-100" />
                </div>
            </>
        );
    }, [nrVaga, dadosVaga]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-screen max-h-screen overflow-hidden z-50  ${!empty(nrVaga) ? "" : "hidden"}`}>
            <div
                className={`relative top-5 mx-auto my-auto border border-slate-400 flex-col h-[80vh] shadow-lg rounded-lg w-1/2 shadow-blue-600  overflow-hidden bg-white`}>
                {vagaToHtml}
                <div className="flex flex-col p-2 absolute bottom-0 bg-white w-full border-t mt-2 border-slate-300">
                    <div className="flex flex-row-reverse w-full">
                        <div className="inline-flex w-fit">
                            <Button buttonType={"danger"} outline={true} onClick={handleClose} size="small">
                                FECHAR
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VagaResumida;