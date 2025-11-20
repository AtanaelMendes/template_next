import Image from 'next/image';

const ImageValores = () => {
  return (
    <div className="flex-col bg-[#2F5597] min-h-screen flex justify-center items-center overflow-hidden relative">
        <div className="absolute top-1/2 left-[30px] transform -translate-y-1/6 w-[150px] h-auto sm:w-[200px] md:w-[280px] lg:w-[350px] xl:w-[400px] z-50 md:scale-75 md:left-[-46px] 2xl:scale-100 2xl:left-[-0px]">
            <img
                src="https://www.rhbrasil.com.br/images/logos/saas/woman2.png"
                alt="Imagem à esquerda"
            />
        </div>

        <div className="absolute top-1/2 right-[-100px] transform -translate-y-1/6 w-[150px] h-auto sm:w-[200px] md:w-[280px] lg:w-[350px] xl:w-[400px] z-50 md:scale-75 md:right-[-155px] 2xl:scale-100">
            <img
                src="https://www.rhbrasil.com.br/images/logos/saas/woman1.png"
                alt="Imagem à direita"
            />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg relative w-8/12 md:w-3/4 lg:w-6/12 translate-y-0 lg:translate-y-10 md:p-2">
            <div className="flex items-center relative">
                <div className="flex-1 text-center px-6 text-xs md:text-sm lg:text-base xl:text-lg relative mt-6">
                    <div className="mb-8">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2F5597] mb-2">Missão</h2>
                        <p className="text-gray-700 leading-relaxed text-normal sm:text-sm xl:text-lg text-justify-center">
                            Conectar talentos a empresas, transformando vidas através do emprego.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2F5597] mb-2">Visão</h2>
                        <p className="text-gray-700 leading-relaxed text-normal sm:text-sm xl:text-lg text-justify-center">
                            Ser reconhecida nacionalmente como a empresa mais inovadora e confiável do setor de recrutamento e trabalho temporário, utilizando a tecnologia para transformar vidas, promover a dignidade profissional e ampliar o acesso ao mercado de trabalho.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2F5597] mb-2">Valores</h2>
                        <p className="text-gray-700 leading-relaxed text-normal sm:text-sm xl:text-lg text-justify-center">
                            Ética & Legalidade,
                            Respeito,
                            Inclusão & Diversidade,
                            Excelência,
                            Inovação & Tecnologia,
                            Meritocracia & Valorização Interna
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-20 h-auto w-[200px] xl:w-80 z-50">
            <img
                src="/images/logos/rhbrasil/logo-rhbrasil.png"
                alt="Logo RH Brasil"
            />
        </div>
        
    </div>
  );
};

export default ImageValores;
