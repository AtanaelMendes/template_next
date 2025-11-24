import { cn } from "@/assets/utils";
import PillsBadge from "@/components/buttons/PillsBadge";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import Title from "@/components/Layouts/Typography";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faEnvelopeCircleCheck,
  faEye,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "@/assets/dateUtils";
import { memo, useMemo } from "react";

const DocumentoRowCandidato = ({ documento, docInfo, indexProrrogacao }) => {
  const signatureCandidato = useMemo(() => {
    const signature = docInfo?.signatures?.filter(
      (sign) =>
        sign?.name ||
        (sign.name?.toUpperCase() !== "PAULO GOES" &&
          !sign.email?.toUpperCase().includes("@RHBRASIL.COM.BR"))
    );
    return signature?.[0];
  }, [docInfo]);

  return (
    <div className="flex flex-row p-2 odd:bg-white even:bg-gray-100 justify-between">
      <div className="flex flex-row gap-2 items-center">
        <Title className={"min-w-28"}>
          {documento?.TIPO_DOC === "R"
            ? `Rescisão`
            : `Prorrogação ${indexProrrogacao}`}
        </Title>
        <PillsBadge
          type={`${
            signatureCandidato?.signed
              ? "success"
              : signatureCandidato?.rejected
              ? "danger"
              : "warning"
          }`}
        >
          {signatureCandidato?.signed
            ? "Assinado"
            : signatureCandidato?.rejected
            ? "Recusado"
            : "Pendente"}
        </PillsBadge>
      </div>
      <div className="flex flex-row items-center gap-2">
        {signatureCandidato ? (
          <>
            <TooltipComponent
              content={
                signatureCandidato?.signed ? (
                  <div className="flex flex-row gap-1">
                    <span className="font-bold">
                      {signatureCandidato?.signed && "Assinado"}
                    </span>
                    em
                    <span className="italic">
                      {signatureCandidato?.signed &&
                        format(
                          new Date(signatureCandidato?.signed?.created_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                    </span>
                  </div>
                ) : signatureCandidato?.rejected ? (
                  <div className="flex flex-col">
                    <span className="font-bold">Recusado</span>
                    <span className="italic">
                      {signatureCandidato?.rejected?.reason &&
                        `Motivo: ${signatureCandidato?.rejected?.reason}`}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold">Não assinado</span>
                )
              }
              asChild
            >
              <FontAwesomeIcon
                icon={faSignature}
                className={cn(
                  signatureCandidato?.signed
                    ? "text-green-500"
                    : signatureCandidato?.rejected
                    ? "text-red-500"
                    : "text-slate-500"
                )}
                width={16}
                height={16}
              />
            </TooltipComponent>

            <TooltipComponent
              content={
                signatureCandidato?.viewed ? (
                  <div className="flex flex-row gap-1">
                    <span className="font-bold">
                      {signatureCandidato?.viewed?.created_at && "Visualizado"}
                    </span>
                    em
                    <span className="italic">
                      {signatureCandidato?.viewed?.created_at &&
                        format(
                          new Date(signatureCandidato?.viewed?.created_at),
                          "dd/MM/yyyy HH:mm"
                        )}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold">Não visualizado</span>
                )
              }
              asChild
            >
              <FontAwesomeIcon
                icon={faEye}
                className={cn(
                  signatureCandidato?.viewed
                    ? "text-green-500"
                    : "text-slate-500"
                )}
                width={16}
                height={16}
              />
            </TooltipComponent>

            <TooltipComponent
              content={
                <div className="flex flex-col">
                  <div className="flex flex-row gap-1">
                    {signatureCandidato?.email_events?.sent ? (
                      <>
                        <span className="font-bold">Enviado</span>
                        em
                        <span>
                          {format(
                            new Date(signatureCandidato?.email_events?.sent),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold">Não enviado</span>
                    )}
                  </div>
                  {!signatureCandidato?.email_events?.delivered &&
                    signatureCandidato?.email_events?.refused && (
                      <span className="text-red-500">
                        Ocorreu algum erro no recebimento do email
                      </span>
                    )}
                </div>
              }
              asChild
            >
              <FontAwesomeIcon
                icon={faEnvelopeCircleCheck}
                className={cn(
                  signatureCandidato?.email_events?.delivered
                    ? "text-green-500"
                    : signatureCandidato?.email_events?.refused ||
                      !signatureCandidato?.email_events?.delivered
                    ? "text-red-500"
                    : "text-slate-500"
                )}
                width={16}
                height={16}
              />
            </TooltipComponent>
          </>
        ) : (
          <>
            <TooltipComponent
              content={`Erro ao carregar informações do documento, contate o suporte`}
              asChild
            >
              <FontAwesomeIcon icon={faCircleQuestion} width={16} height={16} />
            </TooltipComponent>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(DocumentoRowCandidato);
