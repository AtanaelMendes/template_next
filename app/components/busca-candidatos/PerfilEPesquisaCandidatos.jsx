import MiniSidebar from '@/components/Layouts/MiniSidebar'
import {
	faUser,
	faMapMarkerAlt,
	faLanguage,
	faSearch,
	faHistory,
	faEraser,
	faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import FiltroBasico from './FiltroBasico'
import FiltroPessoal from './FiltroPessoal'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '../buttons/Button'
import { useBuscaCandidatosContext } from '@/context/BuscaCandidatosContext'
import FiltroLocalizacao from './FiltroLocalizacao'
import FiltroIdiomas from './FiltroIdiomas'
import CandidatosPorPesquisa from './CandidatosPorPesquisa'
import SmallLoading from '../Layouts/SmallLoading'
import { cn } from '@/assets/utils'
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import Blockquote from '../Layouts/Blockquote'

const PerfilEPesquisaCandidatos = ({ active, horizontal, situacaoVaga }) => {
	const { handleClearFilters, handleSearch, handleGravarPerfilClick, showCandidatos } = useBuscaCandidatosContext()

	const [filtroAtivo, setFiltroAtivo] = useState('basico')
	const [isLoading, setIsLoading] = useState(false)

	const handleItemClick = itemId => {
		setFiltroAtivo(itemId)
	}

	const handleSearchClick = async () => {
		setIsLoading(true)
		await handleSearch()
		setIsLoading(false)
	}

	useEffect(() => {
		setFiltroAtivo(showCandidatos ? 'candidatos' : 'basico')
	}, [showCandidatos])

	const items = [
		{
			id: 'basico',
			label: 'Básicos',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faSearch,
		},
		{
			id: 'pessoal',
			label: 'Pessoal',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faUser,
		},
		{
			id: 'localizacao',
			label: 'Localização',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faMapMarkerAlt,
		},
		{
			id: 'idioma',
			label: 'Idioma',
			className: '',
			hoverClassName: 'hover:bg-gray-200',
			icon: faLanguage,
		},
		showCandidatos && {
			id: 'candidatos',
			label: 'Candidatos',
			className: cn('border border-primary', filtroAtivo !== 'candidatos' && 'animate-pulse'),
			hoverClassName: '',
			icon: faHistory,
		},
	].filter(Boolean)

	if (!active) return null

	if (Number(situacaoVaga) === 13) return (
		<Blockquote type='danger'>
			<div className='flex flex-row gap-2'>
				<FontAwesomeIcon icon={faInfoCircle} width='16' height='16' className='mr-2' />
				<p>Não é possível realizar pesquisas em vagas congeladas. Assim que o pagamento da entrada for confirmado, a pesquisa será liberada.</p>
			</div>
		</Blockquote>
	)

	return (
		<div className={`flex ${horizontal ? 'flex-col' : 'flex-row'} w-full`}>
			<div className='flex flex-col space-x-4 w-full md:w-2/5 p-2'>
				<MiniSidebar
					className={'mr-10'}
					items={items}
					onItemClick={handleItemClick}
					filtroAtivo={filtroAtivo}
					horizontal={horizontal}
					responsiveLabel={false}
				/>
			</div>
			<div className='flex-col w-ful md:w-auto gap-10'>
				<div
					className={`transition-opacity duration-300 ${filtroAtivo !== 'basico' ? 'hidden' : ''}`}
				>
					<FiltroBasico active={filtroAtivo === 'basico'} />
				</div>
				<div
					className={`transition-opacity duration-300 ${filtroAtivo !== 'pessoal' ? 'hidden' : ''}`}
				>
					<FiltroPessoal active={filtroAtivo === 'pessoal'} />
				</div>
				<div
					className={`transition-opacity duration-300 ${
						filtroAtivo !== 'localizacao' ? 'hidden' : ''
					}`}
				>
					<FiltroLocalizacao active={filtroAtivo === 'localizacao'} />
				</div>
				<div
					className={`transition-opacity duration-300 ${filtroAtivo !== 'idioma' ? 'hidden' : ''}`}
				>
					<FiltroIdiomas active={filtroAtivo === 'idioma'} />
				</div>
				<div
					className={`transition-opacity duration-300 ${
						filtroAtivo !== 'candidatos' ? 'hidden' : ''
					}`}
				>
					<CandidatosPorPesquisa active={filtroAtivo === 'candidatos'} />
				</div>
				<div className='flex gap-4 p-4 w-1/2 xl:w-1/3'>
					<Button buttonType='primary' className='flex w-full items-center justify-center' onClick={handleSearchClick}>
						<FontAwesomeIcon icon={faSearch} width='16' height='16' className='mr-2' />
						Pesquisar <SmallLoading active={isLoading} className='ml-2' />
					</Button>
					<Button buttonType='secondary' className='flex w-full items-center justify-center' onClick={handleGravarPerfilClick}>
						<FontAwesomeIcon icon={faFloppyDisk} width='16' height='16' className='mr-2' />
						Gravar
					</Button>
					<Button buttonType='ghost' bordered={true} className='flex w-full items-center justify-center' onClick={handleClearFilters}>
						<FontAwesomeIcon icon={faEraser} width='16' height='16' className='mr-2' />
						Limpar
					</Button>
				</div>
			</div>
		</div>
	)
}

export default PerfilEPesquisaCandidatos
