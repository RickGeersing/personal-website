<script lang="ts">
	import type { User } from '@prisma/client';
	import Input from '$client/components/input/input.svelte';
	import Button from '$client/components/button/button.svelte';
	import { validateFormData, type FormFieldIssues } from '$src/lib/shared/utilities/formData';
	import {
		userSchema,
		userUpdateSchema,
		type UserSchema,
		type UserUpdateSchema
	} from '$src/lib/shared/schemas/userSchema';
	import { z } from 'zod';
	import type { CreateResponse, UpdateResponse } from '$src/lib/shared/types/response';
	import { goto } from '$app/navigation';
	import { route } from '$src/lib/shared/utilities/routes';
	import { addToast } from '$client/components/toast/toast';

	type Props = {
		user?: User;
	};

	let { user }: Props = $props();
	let loading: boolean = $state(false);
	let issues: FormFieldIssues | null = $state(null);
	let errorMessage: string | null = $state(null);

	async function handleSubmit(e: Event) {
		e.preventDefault();

		loading = true;
		issues = null;
		errorMessage = null;

		try {
			const formData = new FormData(e.target as HTMLFormElement);

			if (user) {
				await update(formData);
			} else {
				await create(formData);
			}
		} catch (e) {
			if (e instanceof z.ZodError) {
				issues = e.flatten().fieldErrors;
				addToast({
					type: 'error',
					message: 'Please correct the issues below'
				});
			} else if (e instanceof Error) {
				addToast({
					type: 'error',
					message: e.message
				});
			}
			loading = false;
		}
	}

	async function create(formData: FormData): Promise<void> {
		const payload = validateFormData(formData, userSchema);

		validatePassword(payload, formData);

		const response = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data: CreateResponse<User> = await handleResponse(response, 'create');

		addToast({
			type: 'success',
			message: 'User created successfully'
		});

		loading = false;

		goto(route('user', { id: data.body.id }));
	}

	async function update(formData: FormData): Promise<void> {
		const payload = validateFormData(formData, userUpdateSchema);

		validatePassword(payload, formData);

		const response = await fetch(`/api/users/${user?.id}`, {
			method: 'PUT',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data: UpdateResponse<User> = await handleResponse(response, 'update');

		addToast({
			type: 'success',
			message: 'User updated successfully'
		});

		loading = false;

		goto(route('user', { id: data.body.id }));
	}

	async function handleResponse(
		response: Response,
		type: 'create' | 'update'
	): Promise<CreateResponse<User> | UpdateResponse<User>> {
		const data: CreateResponse<User> | UpdateResponse<User> = await response.json();

		if (!data.success) {
			if (data.code === 'USER_EXISTS') {
				issues = {
					email: ['User with this email already exists']
				};

				throw new Error('User with this email already exists');
			}

			throw new Error('Failed to update user, please try again later');
		}

		return data;
	}

	function validatePassword(data: UserSchema | UserUpdateSchema, formData: FormData): void {
		if (data.password && data.password !== formData.get('confirmPassword')) {
			issues = {
				password: ['Password does not match with the confirmation'],
				confirmPassword: ['Confirmation does not match with the password']
			};

			throw new Error('Passwords do not match');
		}
	}
</script>

<form class="user-detail" onsubmit={handleSubmit}>
	<div class="content">
		<div class="header">
			<h2>{user ? `Edit user: ${user.email}` : 'Creating a new user'}</h2>
		</div>
		<div class="row">
			<Input name="email" label="Email" value={user?.email} errors={issues?.email} />
			<Input name="role" label="Role" value={user?.role} errors={issues?.role} />
		</div>
		<Input name="password" label="Password" type="password" errors={issues?.password} />
		<Input
			name="confirmPassword"
			label="Confirm password"
			type="password"
			errors={issues?.confirmPassword}
		/>
	</div>
	<div class="sidebar">
		<Button {loading} fullWidth={true} type="submit" label="Save changes" />
	</div>
</form>

<style lang="scss">
	@use './userDetail.scss';
</style>
