import { cn } from "@/assets/utils";
import Loading from "@/components/Layouts/Loading";
import ModalGrid from "@/components/Layouts/ModalGrid";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import Title, { Caption } from "@/components/Layouts/Typography";
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@/hooks/useQuery";
import axiosInstance from "@/plugins/axios";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useState } from "react";

export const DivulgaRedesSociais = ({ nrRequisicao, nrVaga }) => {
    const { toast } = useAppContext();
    const [modalControl, setModalControl] = useState(false);
    const [modalControlDelete, setModalControlDelete] = useState(false);
    const [selectedSocialMedia, setSelectedSocialMedia] = useState(null);

    const { data: isVagaLiberada, isLoading: isLoadingVagaLiberada } = useQuery({
        queryFn: () => axiosInstance.get(`vaga/requisicao-vaga-liberada-internet/${nrVaga}`),
        onError: (error) => {
            toast.error("Erro ao buscar divulgações da vaga");
            console.error(error);
        },
    });

    const {
        refetch,
        data: socialMedia,
        isLoading: isLoadingData,
    } = useQuery({
        queryFn: () => axiosInstance.get(`vaga/divulgacoes-redes-sociais/${nrRequisicao}`),
        onError: (error) => {
            toast.error("Erro ao buscar divulgações da vaga");
            console.error(error);
        },
        enabled: !!isVagaLiberada && !isLoadingVagaLiberada,
    });

    const divulgarVaga = async (cd_integracao) => {
        await axiosInstance
            .post(`vaga/${nrVaga}/divulgar-requisicao-redes-sociais/${nrRequisicao}`, {
                cd_integracao: cd_integracao,
            })
            .then(() => {
                refetch();
                toast.success("Vaga inserida na fila de divulgação com sucesso");
            })
            .catch((err) => {
                console.error(err);
                toast.error(err);
            })
            .finally(() => {
                setModalControl(false);
                setSelectedSocialMedia(null);
            });
    };

    const removerDivulgacaoVaga = async (cd_integracao) => {
        await axiosInstance
            .post(`vaga/remover-divulgacao-rede-social/${nrRequisicao}`, {
                cd_integracao: cd_integracao,
            })
            .then(() => {
                refetch();
                toast.success("Vaga removida da fila de divulgação com sucesso");
            })
            .catch((err) => {
                console.error(err);
                toast.error(err);
            })
            .finally(() => {
                setModalControlDelete(false);
                setSelectedSocialMedia(null);
            });
    };

    const onClickSelectSocialMedia = (social, type) => {
        setSelectedSocialMedia(social);
        type === "delete" ? setModalControlDelete(true) : setModalControl(true);
    };

    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

    return (
        <>
            <div className="col-span-12 md:col-span-9 relative">
                {isLoadingData && isLoadingVagaLiberada ? (
                    <Loading active={true} />
                ) : (
                    <div className="flex flex-wrap justify-center gap-8 p-4 md:p-12">
                        {socialMedia?.map((social) => (
                            <div
                                key={social.CD_INTEGRACAO}
                                className={cn(
                                    "flex flex-col rounded-md border border-gray-300 w-full sm:w-1/2 md:w-1/4",
                                    social.DIVULGADO === "S"
                                        ? "bg-green-100 border-green-500"
                                        : "bg-white"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex justify-center items-center rounded-t-md p-2 text-white relative",
                                        social.DIVULGADO === "S" ? "bg-green-500" : "bg-primary"
                                    )}
                                >
                                    <span className="font-bold text-center w-full">
                                        {social.NM_INTEGRACAO}
                                    </span>
                                    {(social.NM_INTEGRACAO === "Jooble" ||
                                        social.NM_INTEGRACAO === "Talent") &&
                                        social.DIVULGADO === "N" && (
                                            <div className="absolute right-2 top-2">
                                                <TooltipComponent
                                                    content="Efetivação da divulgação em até 24hs"
                                                    asChild
                                                    usePortal={false}
                                                >
                                                    <span className="flex items-center justify-center w-4 h-4 p-1 bg-none border border-white text-white rounded-full cursor-pointer">
                                                        <FontAwesomeIcon
                                                            icon={faInfo}
                                                            width={8}
                                                            height={8}
                                                        />
                                                    </span>
                                                </TooltipComponent>
                                            </div>
                                        )}

                                    {social.DIVULGADO === "S" && social.DATA_DIVULGACAO && (
                                        <div className="absolute right-2 top-2">
                                            <TooltipComponent
                                                content={`Divulgada em: ${social.DATA_DIVULGACAO}`}
                                                asChild
                                                usePortal={false}
                                            >
                                                <span className="flex items-center justify-center w-4 h-4 p-1 bg-none border border-white text-white rounded-full cursor-pointer">
                                                    <FontAwesomeIcon
                                                        icon={faInfo}
                                                        width={8}
                                                        height={8}
                                                    />
                                                </span>
                                            </TooltipComponent>
                                        </div>
                                    )}
                                </div>
                                <div className={"p-4 h-40 w-40 mx-auto flex items-center"}>
                                    <Image
                                        src={`${
                                            isLocalhost ? "" : "/saas"
                                        }/images/logos/divulgacao-vagas/${social.NM_INTEGRACAO.toLowerCase()}-logo.svg`}
                                        width={128}
                                        height={128}
                                        alt={social.NM_INTEGRACAO}
                                    />
                                </div>
                                <button
                                    className={cn(
                                        "w-full rounded-b-md border-t  p-2 font-semibold border-gray-300 hover:bg-gray-100",
                                        social.DIVULGADO === "S" &&
                                            "bg-red-500 text-white hover:bg-red-600"
                                    )}
                                    onClick={() =>
                                        social.DIVULGADO === "S"
                                            ? onClickSelectSocialMedia(social, "delete")
                                            : onClickSelectSocialMedia(social, "insert")
                                    }
                                >
                                    {social.DIVULGADO === "S"
                                        ? "Remover divulgação"
                                        : "Divulgar vaga"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {isVagaLiberada === "N" && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center p-4 bg-white rounded-md shadow-md">
                            <p className="text-gray-700 font-semibold">
                                Para acessar essa funcionalidade, habilite divulgação na internet no
                                Divulga Web
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <ModalGrid
                modalControl={modalControl}
                setModalControl={setModalControl}
                submitCallBack={() => divulgarVaga(selectedSocialMedia?.CD_INTEGRACAO)}
                btnSubmit="Divulgar"
                btnCancel="Cancelar"
                title="Divulgar vaga"
                size="sm"
                height="h-fit"
            >
                <div className="flex flex-col gap-8 items-center">
                    <Title className={"text-2xl"}>
                        Deseja divulgar a vaga no(a) {selectedSocialMedia?.NM_INTEGRACAO}?
                    </Title>
                    <Image
                        src={`${
                            isLocalhost ? "" : "/saas"
                        }/images/logos/divulgacao-vagas/${selectedSocialMedia?.NM_INTEGRACAO.toLowerCase()}-logo.svg`}
                        width={128}
                        height={128}
                        alt={selectedSocialMedia?.NM_INTEGRACAO}
                    />
                </div>
            </ModalGrid>

            <ModalGrid
                modalControl={modalControlDelete}
                setModalControl={setModalControlDelete}
                submitCallBack={() => removerDivulgacaoVaga(selectedSocialMedia?.CD_INTEGRACAO)}
                btnSubmit="Remover"
                btnCancel="Cancelar"
                title="Remover divulgação"
                size="sm"
                height="h-fit"
            >
                <div className="flex flex-col gap-8 items-center">
                    <Title className={"text-2xl"}>
                        Deseja remover a divugação da vaga no(a){" "}
                        {selectedSocialMedia?.NM_INTEGRACAO}?
                    </Title>
                    <Image
                        src={`${
                            isLocalhost ? "" : "/saas"
                        }/images/logos/divulgacao-vagas/${selectedSocialMedia?.NM_INTEGRACAO.toLowerCase()}-logo.svg`}
                        width={128}
                        height={128}
                        alt={selectedSocialMedia?.NM_INTEGRACAO}
                    />
                </div>
            </ModalGrid>
        </>
    );
};
