import { actionClassCache } from "@/lib/actionClass/cache";
import { cache } from "@/lib/cache";
import { validateInputs } from "@/lib/utils/validate";
import { cache as reactCache } from "react";
import { prisma } from "@formbricks/database";
import { ZId } from "@formbricks/types/common";
import { DatabaseError } from "@formbricks/types/errors";
import { TJsEnvironmentStateActionClass } from "@formbricks/types/js";

export const getActionClassesForEnvironmentState = reactCache(
  async (environmentId: string): Promise<TJsEnvironmentStateActionClass[]> =>
    cache(
      async () => {
        validateInputs([environmentId, ZId]);

        try {
          return await prisma.actionClass.findMany({
            where: {
              environmentId: environmentId,
            },
            select: {
              id: true,
              type: true,
              name: true,
              key: true,
              noCodeConfig: true,
            },
          });
        } catch (error) {
          throw new DatabaseError(`Database error when fetching actions for environment ${environmentId}`);
        }
      },
      [`getActionClassesForEnvironmentState-${environmentId}`],
      {
        tags: [actionClassCache.tag.byEnvironmentId(environmentId)],
      }
    )()
);
