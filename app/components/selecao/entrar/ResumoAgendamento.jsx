import Title, { Caption, Label, Subtitle } from "@/components/Layouts/Typography";
import NoDataFound from "@/components/Layouts/NoDataFound";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { toast } from "react-toastify";
import { cn } from "@/assets/utils";

const ResumoAgendamento = ({
    id,
    active,
    cdPessoa,
    criadoEm,
    handleClose
}) => {
    const [dados, setDados] = useState([]);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (active && criadoEm) {
            getAgendamento();
        } else {
            onCloseAction();
        }
    }, [active, criadoEm]);

    const getAgendamento = useCallback(() => {
        setShowLoading(true);
        axiosInstance
            .get(`agendamento/dados-agendamento/${cdPessoa}/${criadoEm}`)
            .then(function (response) {
                setDados(response.data);
                setShowLoading(false);
            })
            .catch(function (error) {
                toast.error("Não foi possível carregar os dados do agendamento.");
                console.error(error);
                onCloseAction();
            });
    }, [cdPessoa, criadoEm]);

    const onCloseAction = () => {
        setDados([]);

        if (typeof handleClose == 'function') {
            handleClose();
        }
    };

    const renderData = useCallback(() => {
        if (Object.keys(dados)?.length === 0) {
            return <NoDataFound isLoading={showLoading} />;
        }

        return <>
            <div id={id} className={`flex flex-col p-3`}>
                <div className={cn('grid grid-cols-2', dados?.CD_USUARIO_ATENDIMENTO ? '' : 'hidden')}>
                    <Caption className={"font-semibold"}>{`Analista: `}</Caption>
                    <Label className={"font-semibold"}>{`${dados?.NM_USUARIO_ATENDIMENTO}`}</Label>
                </div>

                <div className="grid grid-cols-2">
                    <Caption className={"font-semibold"}>{`Tipo de agendamento: `}</Caption>
                    <Label className={"font-semibold"}>{dados?.TIPO_AGENDAMENTO}</Label>
                </div>

                <div className={cn('grid grid-cols-2', dados?.CD_PESSOA_CLIENTE ? '' : 'hidden')}>
                    <Caption className={"font-semibold"}>{`Cliente: `}</Caption>
                    <Label className={"font-semibold"}>{`${dados?.CD_PESSOA_CLIENTE} - ${dados?.NM_PESSOA_CLIENTE}`}</Label>
                </div>

                <div className={cn("grid grid-cols-2", dados?.TIPO_PROCESSO ? '' : 'hidden')}>
                    <Caption className={"font-semibold"}>{`Tipo de processo: `}</Caption>
                    <Label className={"font-semibold"}>{dados?.TIPO_PROCESSO}</Label>
                </div>

                <div className={cn('grid grid-cols-2', dados?.DT_ATENDIMENTO ? '' : 'hidden')}>
                    <Caption className={"font-semibold"}>{`Data de atendimento: `}</Caption>
                    <Label className={"font-semibold"}>{dados?.DT_ATENDIMENTO}</Label>
                </div>

                <div className={cn('grid grid-cols-2', dados?.DT_CHEGADA ? '' : 'hidden')}>
                    <Caption className={"font-semibold"}>{`Data de chegada: `}</Caption>
                    <Label className={"font-semibold"}>{dados?.DT_CHEGADA}</Label>
                </div>

                <div className={cn('grid grid-cols-2', dados?.DT_ENCERRAMENTO ? '' : 'hidden')}>
                    <Caption className={"font-semibold"}>{`Data de encerramento: `}</Caption>
                    <Label className={"font-semibold"}>{dados?.DT_ENCERRAMENTO}</Label>
                </div>
            </div>
        </>
    }, [dados]);

    return (
        <div
            id={`${id}_resumo_agendamento`}
            className={cn(`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`, active ? "" : "hidden")}
        >
            <div
                onClick={(e) => { e.stopPropagation(); }}
                className={cn(
                    "relative rounded-lg flex flex-col max-h-screen bg-white",
                    "h-1/3",
                    "w-auto",
                )}
            >
                <div className="bg-primary text-white rounded-t-lg p-2">
                    <Title className={"ps-2"}>Resumo do agendamento</Title>
                    <button className="absolute top-2 right-2 rounded-full cursor-pointer hover:bg-white/10" onClick={onCloseAction} >
                        <svg className={cn("w-5 h-5 m-1", "fill-white")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" >
                            <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                        </svg>
                    </button>
                </div>
                {renderData()}
                <div>
                    <div className={cn("absolute p-2 h-[46px] border-t border-slate-300 bg-white w-full bottom-0 rounded-b-lg text-right")} >
                        <Button buttonType="danger" outline onClick={() => { onCloseAction() }} size="small" className={"mr-4"}>
                            FECHAR
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ResumoAgendamento;
